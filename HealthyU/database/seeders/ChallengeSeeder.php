<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        DB::table('challenges')->insert([
            'name' => 'Step Towards Rewards',
            'description' => 'Walk 5000 steps to unlock exciting rewards. Each step you take brings you closer to a healthier lifestyle—keep moving and enjoy the benefits!',
            // 'image' => $faker->imageUrl(640,480,'walk'),
            'created_at' => now()->format('Y-m-d H:i:s'),
            'updated_at' => now()->format('Y-m-d H:i:s')
        ]);
    }
}
