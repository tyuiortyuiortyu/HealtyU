<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedSchedule extends Model
{
    use HasFactory;
    protected $table = "med_schedules";
    protected $fillable = [
        'med_id',
        'time_to_take',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];

    public function medicines()
    {
        return $this->belongsTo(Medicine::class, 'med_id');
    }
}
