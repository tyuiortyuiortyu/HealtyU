<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        Unit::create(['name' => 'mg']);
        Unit::create(['name' => 'ml']);
        Unit::create(['name' => 'tablet(s)']);
    }
}
