<?php

namespace Lara\Http\Controllers;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Lara\Http\Middleware\RejectGuests;

use Lara\Http\Requests\Request;
use Lara\Shift;
use Lara\User;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;
use PragmaRX\Google2FA\Google2FA;

class UserPersonalPageController extends Controller
{
    public function __construct()
    {
        $this->middleware(RejectGuests::class);
    }

    public function showPersonalPage()
    {
        $user = \Auth::user();

        $shifts = Shift::query()->where('person_id', '=', $user->person->id)
            ->with("schedule", "schedule.event.section", "schedule.event", "type")
            ->whereHas("schedule.event", function ($query) {
                $query->where('evnt_date_start', '>=', new \DateTime());
            })
            ->get()->sortBy('schedule.event.evnt_date_start');
        /** @var Google2FA $google2fa */
        $google2fa = app('pragmarx.google2fa');
        $secret = $google2fa->generateSecretKey();
        $qrImage = $google2fa->getQRCodeInline(config('app.name'), \Auth::user()->email, $secret);

        return View::make('userpersonalpage.index', compact('user', 'shifts', 'secret', 'qrImage'));
    }

    public function updatePerson()
    {
        $user = \Auth::user();
        $isNamePrivate = Input::get("is_name_private") == 'null' ? null : Input::get("is_name_private") == 'true';
        $user->is_name_private = $isNamePrivate;
        $user->save();
        // Return to the the section management page
        Session::put('message', trans('mainLang.changesSaved'));
        Session::put('msgType', 'success');

        return \Redirect::back();
    }

    public function registerGoogleAuth()
    {
        /** @var Google2FA $google2fa */
        $google2fa = app('pragmarx.google2fa');
        $secret = Input::get("secret");
        $currentCode = Input::get('currentCode');
        if (!$this->validateGoogle2fa($google2fa, $currentCode, $secret)) {
            return Redirect::back()->withInput(Input::all())->withErrors(['code'=>'invalid code']);
        }
        /** @var User $user */
        $user = \Auth::user();
        $user->setGoogle2faSecretAttribute($secret);
        $user->save();
        \Session::put('2faVeryfied', true);
        return Redirect::route('user.personalpage');
    }

    public function unregisterGoogleAuth()
    {
        /** @var User $user */
        $user = \Auth::user();
        $user->google2fa_secret = '';
        $user->save();
        return Redirect::back();
    }

    private function validateGoogle2fa(Google2FA $google2fa, $key, $secret)
    {
        try {
            return $google2fa->verify($key, $secret);
        } catch (IncompatibleWithGoogleAuthenticatorException $e) {
            return false;
        } catch (InvalidCharactersException $e) {
            return false;
        } catch (SecretKeyTooShortException $e) {
            return false;
        }
    }
}
