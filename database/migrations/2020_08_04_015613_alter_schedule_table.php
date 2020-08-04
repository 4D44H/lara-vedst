<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterScheduleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->renameColumn('evnt_id', 'tmp_evnt_id');
        });
        Schema::table('schedules', function (Blueprint $table) {
            $table->integer('evnt_id')->unsigned()->nullable(false);
        });
        DB::statement(' update schedules set evnt_id= tmp_evnt_id  ');
        DB::statement('delete from schedules where evnt_id = 0');
        DB::commit();
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn('tmp_evnt_id');
            $table->foreign('evnt_id')->references('id')->on('club_events');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->renameColumn('evnt_id', 'tmp_evnt_id');
        });
        Schema::table('schedules', function (Blueprint $table) {
            $table->string('evnt_id')->references('id')->on('club_events');
        });
        DB::statement(' update schedules set evnt_id= tmp_evnt_id  ');
        DB::commit();
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn('tmp_evnt_id');
        });
    }
}
