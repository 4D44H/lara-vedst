<?php

namespace Lara\Http\Controllers;

use Illuminate\Http\Request;
use Lara\SurveyAnswerOption;
use Session;
use Redirect;

use Carbon\Carbon;
use Lara\Survey;
use Lara\SurveyQuestion;
use View;
use Input;

class SurveyController extends Controller
{
    public function index()
    {

    }
    public function create($year = null, $month = null, $day = null)
    {
        //dont creates surveys, just returns the createSurveyView with todays date
        if ( is_null($year) ) {
            $year = date("Y");
        }

        if ( is_null($month) ) {
            $month = date("m");
        }

        if ( is_null($day) ) {
            $day = date("d");
        }

        // prepare correct date and time format to be used in forms for deadline/in_calendar
        $date = strftime("%d-%m-%Y", strtotime($year.$month.$day));
        $time = strftime("%d-%m-%Y %H:%M:%S", strtotime($year.$month.$day));

        //surveyForm uses $questions for editing purposes
        //has here to be filled with standard questions like this
        /*$questions = [array("id" => 20,
                            "survey_id" => 22,
                            "order" => 0,
                            "field_type" => 1,
                            "question" => "Kommst du?",
                            "createdAt" => Carbon::now(),
                            "updatedAt" => Carbon::now()
                        ),
                        array("id" => 21,
                            "survey_id" => 22,
                            "order" => 1,
                            "field_type" => 1,
                            "question" => "Bringst du jemanden mit?",
                            "createdAt" => Carbon::now(),
                            "updatedAt" => Carbon::now()
                        )
                    ];
         */
        return View('createSurveyView', compact('date','time','questions'));
    }

    /**
     * @param Request $input
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $input)
    {
        $survey = new Survey;
        $survey->creator_id = Session::get('userId');
        $survey->title = $input->title;
        //if URL is in the description, convert it to clickable hyperlink
        $survey->description = $this->addLinks($input->description);

        $survey->deadline = strftime("%Y-%m-%d %H:%M:%S", strtotime($input->deadline));
        $survey->in_calendar = strftime("%Y-%m-%d", strtotime($input->in_calendar));
        $survey->save();

        foreach($input->questions as $order => $question){
            $question_db = new SurveyQuestion();
            $question_db->survey_id = $survey->id;
            $question_db->order = $order;
            $question_db->field_type = 1; //example
            $question_db->question = $question;
            $question_db->save();
        }

        return Redirect::action('SurveyController@show', array('id' => $survey->id));
    }


    /**
     * "getAnswers" does not work as expected, right now use this:
     * SurveyAnswer::whereSurveyQuestionId($question->id)->get()
     * @param $id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show($id)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //find questions
        $questions = $survey->getQuestions;

        //find answers(as collection object) to an array with the questionid as index
        foreach($questions as $question) {
            $answers[$question->id] = $question->getAnswers;
        }
        return view('surveyView', compact('survey', 'questions', 'answers'));
    }

    public function edit($id)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //find questions and answer options
        $questions = $survey->getQuestions;
        foreach($questions as $question)
            $answer_options = $question->getAnswerOptions;

        // prepare correct date and time format to be used in forms for deadline/in_calendar
        $date = strftime("%d-%m-%Y", strtotime($survey->in_calendar));
        $time = strftime("%d-%m-%Y %H:%M:%S", strtotime($survey->deadline));
        return view('editSurveyView', compact('survey', 'questions', 'answer_options', 'date', 'time'));
    }
    
    public function update($id, Request $input)
    {
        //find survey
        $survey = Survey::findOrFail($id);

        //edit existing survey
        $survey->title = $input->title;
        //if URL is in the description, convert it to clickable hyperlink
        $survey->description = $this->addLinks($input->description);


        //format deadline and in_calender for database
        $survey->deadline = strftime("%Y-%m-%d %H:%M:%S", strtotime($input->deadline));
        $survey->in_calendar = strftime("%Y-%m-%d", strtotime($input->in_calendar));
        //$survey->isAnonymous = &input->isAnonymous;
        //$survey->isSecretResult = §input->isSecretResult;

        //get questions and answer options from database
        $questions_db = $survey->getQuestions;
        foreach($questions_db as $question) {
            $answer_options_db[] = $question->getAnswerOptions;
        }

        //old questions and answer options to arrays with objects as elements
        $questions_db = (array) $questions_db;
        $questions_db = array_shift($questions_db);
        for($i = 0; $i < count($answer_options_db); $i++) {
            $answer_options_db[$i] = (array) $answer_options_db[$i];
            $answer_options_db[$i] = array_shift($answer_options_db[$i]);
        }

        //get questions and answer options from the input
        $questions_new = $input->questions;
        $answer_options_new = $input->answer_options;
        $field_type = $input->type;

        //ignore empty questions, answer options and questions without field type
        foreach($questions_new as $i => $question) {

            //check if empty question exists
            if (empty($question)) {

                //ignore question
                unset($questions_new[$i]);
                $questions_new = array_values(array_filter($questions_new));

                /* ignore answer options from empty dropdown question, type identifies question types
                 * type = 0: no type given from user, delete question
                 * 1: text field
                 * 2: checkbox
                 * 3: dropdown, has answer options
                 */
                if($field_type[$i] = 3) {
                    unset($answer_options_new[$i]);
                    $answer_options_new = array_values(array_filter($answer_options_new));
                }

            }

            //check if empty answer options exists
            if($field_type[$i] === 3) {
                foreach($answer_options_new[$i] as $j => $answer_option) {
                    if (empty($answer_option->answer_option)) {
                        unset($answer_options_new[$i][$j]);
                        $answer_options_new[$i] = array_values(array_filter($answer_options_new[$i]));
                    }
                }
            }

            //check if no field type was given from user (type = 0)
            if ($field_type[$i] === 0) {

                //ignore question and answer options
                unset($questions_new[$i]);
                unset($answer_options_new[$i]);

                //reindexing
                $questions_new = array_values(array_filter($questions_new));
                $answer_options_new = array_values(array_filter($answer_options_new));

            }
        }

        //sort database array by order
        usort($questions_db, array($this, "cmp"));

        //make question arrays have the same length
        if(count($questions_new) > count($questions_db)) {

            //more questions in input than in database
            //make new empty questions and push them to the database array
            for($i=count($questions_new); $i >= count($questions_db) ; $i--) {
                array_push($questions_db, new SurveyQuestion());

                //also push to the array for the database answer options
                //to make sure questions and answer option arrays have the same length
                array_push($answer_options_db, []);
            }
        }

        if(count($questions_db) > count($questions_new)) {

            //less questions in input than in database
            //delete unnecessary questions and answer options in database
            for($i=count($questions_db)-1; $i > count($questions_new) ; $i--) {
                $question = SurveyQuestion::FindOrFail($questions_db[$i]->id);
                foreach($question->getAnswerOptions() as $key => $answer_option) {
                    $answer_option->delete();
                }
                $question->delete();

                //delete questions in the arrays
                unset($questions_db[$i]);
                unset($answer_options_db[$i]);

                //reindexing
                $questions_db = array_values(array_filter($questions_db));
                $answer_options_db = array_values(array_filter($answer_options_db));
            }
        }

        //all arrays should have the same length now
        for($i = 0; $i < count($questions_db); $i++) {

            $questions_db[$i]->field_type = $field_type[$i];
            $questions_db[$i]->order = $i;
            $questions_db[$i]->question = $questions_new[$i];

            //survey_id has to be filled in case of new questions
            $questions_db[$i]->survey_id = $survey->id;

            $questions_db[$i]->save();

            //check if question is dropdown question
            if ($questions_db[$i]->field_type === 3) {

                //make answer options arrays have the same length
                if (count($answer_options_new[$i]) > count($answer_options_db[$i])) {

                    //more answer options in input than in database
                    //make new empty answer options and push them to the database array
                    for($j = count($answer_options_new); $j >= count($answer_options_db[$i]); $j--) {
                        array_push($answer_options_db, new SurveyAnswerOption());
                    }
                }

                if (count($answer_options_db[$i]) > count($answer_options_new[$i])) {

                    //less answer options in input than in database
                    //delete unnecessary answer options in database
                    for($j = count($answer_options_db); $j > count($answer_options_new[$i]); $j--) {
                        $answer_option = SurveyAnswerOption::FindOrFail($answer_options_db[$i][$j]->id);
                        $answer_option->delete();

                        //also delete element in answer option array and reindex array keys
                        unset($answer_options_db[$i][$j]);
                        $answer_options_db[$i] = array_values(array_filter($answer_options_db[$i]));
                    }
                }

                //answer option arrays should have the same length now
                for($j = 0; $j < count($answer_options_db[$i]); $j++) {
                    $answer_options_db[$i][$j]->survey_question_id = $questions_db[$i]->id;
                    $answer_options_db[$i][$j]->answer_option = $answer_options_new[$i][$j]->answer_option;
                    $answer_options_db[$i][$j]->save();
                }
            }
        }

        $survey->save();

        //get updated questions for the view
        $questions = $survey->getQuestions;
        foreach($questions as $question) {
            $answer_options = $question->getAnswerOptions;
        }
        return view('surveyView', compact('survey','questions', 'answer_options'));
    }


    public function destroy()
    {
        //;
    }

    /*
     *  -------------------- END OF REST-CONTROLLER --------------------
     */

    private function cmp($a, $b)
    {
        if ($a->order == $b->order) {
            return 0;
        }
        return ($a->order < $b->order) ? -1 : 1;
    }

    private function addLinks($text) {
        $text = preg_replace('$(https?://[a-z0-9_./?=&#-]+)(?![^<>]*>)$i',
            ' <a href="$1" target="_blank">$1</a> ',
            $text);
        $text = preg_replace('$(www\.[a-z0-9_./?=&#-]+)(?![^<>]*>)$i',
            '<a target="_blank" href="http://$1"  target="_blank">$1</a> ',
            $text);
        return $text;
    }

}
