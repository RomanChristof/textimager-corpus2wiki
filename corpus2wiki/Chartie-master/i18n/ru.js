var scale_types = [{
  name  : "general",
  title : "Установите значение",
  units : [  "а",    "ф",       "п",           "н",             "м",               "c",               "д",                 "",                   "К",                      "М",                       "Г",                            "Т",                              "П"                 ],
  coeffs: [ 1000,  1000000,  1000000000,  1000000000000,  1000000000000000, 10000000000000000, 100000000000000000, 1000000000000000000, 1000000000000000000000, 1000000000000000000000000, 1000000000000000000000000000, 1000000000000000000000000000000, 1000000000000000000000000000000000]
},
{
  name  : "time",
  title : "Время",
  units : ["с", "мин", "час", "день",  "месяц",  "год" ],
  coeffs: [ 1,   60,    3600,  86400,  2629728, 31556736]
},
{
  name  : "mass",
  title : "Масса",
  units : ["мг", "карат",  "г",  "унций",  "фунтов",    "кг",    "тонн"   ],
  coeffs: [ 1,   200,  1000, 28350, 453600, 1000000, 1000000000]
},
{
  name  : "length",
  title : "Длина",
  units : ["мм", "см", "дюйм",  "футов",   "ярд",  "м",   "км",   "миль" ],
  coeffs: [ 1,    10,   25.4,    304.8,    914.4,  1000, 1000000, 1609000]
},
{
  name  : "area",
  title : "Площадь",
  units : ["мм2", "см2", "дюйм2", "дм2", "футов2",  "ярд2",    "м2",     "ар",       "декар",      "акр",      "гектар",        "км2",         "миль2"   ],
  coeffs: [ 1,     100,  645.2,   10000,  92900,    836100,  1000000,  100000000,  1000000000,  4047000000,  10000000000,   1000000000000,  2590000000000]
},
{
  name  : "volume",
  title : "Объем",
  units : ["мм3", "см",  "пинт",    "кварт",    "литров",    "галлон",    "баррель",      "м3",           "км3"       ],
  coeffs: [  1,   1000,  473200,    946400,     1000000,     3785000,     159000000,   1000000000, 1000000000000000000]
},
{
  name  : "speed",
  title : "Скорость",
  units : ["м/с", "узлов", "миль/ч",  "фут/с", "км/ч", "км/с",    "c"   ],
  coeffs: [  1,    1.944,   2.237,     3.281,   3.6,    1000,  299792458]
},
{
  name  : "temp",
  title : "Температура",
  units : ["C", "K", "F", "Ra"]
},
{
  name  : "solub",
  title : "Растворимость",
  units : ["гр/100 гр", "%"]
}];

var def_legend_title  = "Растворители:";