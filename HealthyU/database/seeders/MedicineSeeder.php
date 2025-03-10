<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Medicine;

class MedicineSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 10; $i++) {
            Medicine::create([
            'user_id' => $faker->numberBetween(1,3),
            'unit_id' => $faker->numberBetween(1, 3),
            'med_name' => $faker->word,
            'med_dose' => $faker->randomFloat(2, 1, 500),
            'type' => $faker->randomElement(['Pil', 'Sirup', 'Tetes', 'Krim', 'Tablet']),
            'duration' => $faker->numberBetween(1, 30),
            ]);
        }

    }
}
