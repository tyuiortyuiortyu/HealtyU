<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        DB::table('users')->insert([
            'name' => 'Michael Kurniawan',
            'email' => 'mchlkk98@gmail.com',
            'email_verified_at' => '2024-12-24 16:51:00',
            'username' => 'michaelkurniawan',
            'password' => bcrypt('mikel123'),
            'dob' => '2005-10-10',
            'sex' => 'Male',
            'weight' => 58,
            'height' => 177,
            'last_login' => null,
            'date_created' => Carbon::now()->format('Y-m-d H:i:s'),
            'date_modified' => Carbon::now()->format('Y-m-d H:i:s'),
            'role' => 'admin'
        ]);

        DB::table('users')->insert([
            'name' => 'Bodhi',
            'email' => 'flavianus.thamzir@binus.ac.id',
            'email_verified_at' => '2024-12-24 16:51:00',
            'username' => 'flavi_bodhi',
            'password' => bcrypt('bodhi123'),
            'dob' => '2005-03-11',
            'sex' => 'Male',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'date_created' => Carbon::now()->format('Y-m-d H:i:s'),
            'date_modified' => Carbon::now()->format('Y-m-d H:i:s'),
            'role' => 'admin'
        ]);

        DB::table('users')->insert([
            'name' => 'Nikita',
            'email' => 'nikita.niki2410@gmail.com',
            'email_verified_at' => '2024-12-24 16:51:00',
            'username' => 'nikita_smile',
            'password' => bcrypt('smile123'),
            'dob' => '2005-10-24',
            'sex' => 'Female',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'date_created' => Carbon::now()->format('Y-m-d H:i:s'),
            'date_modified' => Carbon::now()->format('Y-m-d H:i:s'),
            'role' => 'user'
        ]);
    }
}
