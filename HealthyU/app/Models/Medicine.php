<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;
    protected $table = "medicines";
    protected $fillable = [
        'user_id',
        'unit_id',
        'med_name',
        'med_dose',
        'food_relation',
        'duration'
    ];

    public function unit(){
        return $this->belongsTo(Unit::class, 'unit_id');
    }
}
