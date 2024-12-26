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
        $now = Carbon::now()->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s');

        DB::table('users')->insert([
            'name' => 'Michael Kurniawan',
            'email' => 'mchlkk98@gmail.com',
            'email_verified_at' => $now,
            'username' => 'michaelkurniawan',
            'password' => bcrypt('mikel123'),
            'dob' => '2005-10-10',
            'sex' => 'Male',
            'weight' => 58,
            'height' => 177,
            'last_login' => null,
            'created_at' => $now,
            'updated_at' => $now,
            'role' => 'admin'
        ]);

        DB::table('users')->insert([
            'name' => 'Flavianus Bodhi',
            'email' => 'flavianus.thamzir@binus.ac.id',
            'email_verified_at' => $now,
            'username' => 'flavi_bodhi',
            'password' => bcrypt('bodhi123'),
            'dob' => '2005-03-11',
            'sex' => 'Male',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'created_at' => $now,
            'updated_at' => $now,
            'role' => 'admin'
        ]);

        DB::table('users')->insert([
            'name' => 'Nikita',
            'email' => 'nikita.niki2410@gmail.com',
            'email_verified_at' => $now,
            'username' => 'nikita_smile',
            'password' => bcrypt('smile123'),
            'dob' => '2005-10-24',
            'sex' => 'Female',
            'weight' => $faker->randomFloat(2, 40, 100),
            'height' => $faker->randomFloat(2, 150, 200),
            'last_login' => null,
            'created_at' => $now,
            'updated_at' => $now,
            'role' => 'user'
        ]);
        
        for ($i = 0; $i < 20; $i++) {
            DB::table('users')->insert([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'email_verified_at' => $now,
                'username' => $faker->unique()->userName,
                'password' => bcrypt('healthyu123'),
                'dob' => $faker->date('Y-m-d', '2005-12-31'),
                'sex' => $faker->randomElement(['Male', 'Female']),
                'weight' => $faker->randomFloat(2, 40, 100),
                'height' => $faker->randomFloat(2, 150, 200),
                'last_login' => null,
                'created_at' => $now,
                'updated_at' => $now,
                'role' => $faker->randomElement(['user', 'admin'])
            ]);
        }
    }
}
