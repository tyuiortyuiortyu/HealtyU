<?php

namespace Database\Seeders;

use App\Models\MedSchedule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedScheduleSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 10; $i++) {
            MedSchedule::create([
            'med_id' => $i,
            'time_to_take' => $faker->time($format = 'H:i:s'),
            'date_to_take' => $faker->date($format = 'Y-m-d', $max = 'now'),
            ]);
        }
    }
}