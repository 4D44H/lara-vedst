<?php

namespace Lara\Http\Controllers;

//use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Rap2hpoutre\LaravelLogViewer\LaravelLogViewer;


class LogViewerController extends Controller
{

    public function index()
    {
        $request =request();
        $logViewer = new LaravelLogViewer();
        if ($request->input('l')) {
            $logViewer->setFile(base64_decode($request->input('l')));
        }

        if ($request->input('dl')) {
            return Response::download(storage_path() . '/logs/' . base64_decode($request->input('dl')));
        } elseif (Request::has('del')) {
            File::delete(storage_path() . '/logs/' . base64_decode(request('del')));
            return Redirect::to(Request::url());
        }


        $logs = $logViewer->all();;

        return View::make('log', [
            'logs' => $logs,
            'files' => $logViewer->getFiles(true),
            'current_file' => $logViewer->getFileName()
        ]);
    }

}
