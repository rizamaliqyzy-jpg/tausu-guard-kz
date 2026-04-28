/* ============================================================
   I18N.JS — Translations + language switcher (ES module)
   Fix #1:  currentLang exported — no global leak
   Fix #2:  setLang wrapper removed; kz/kk naming unified
   Fix #3:  innerHTML only for whitelisted keys
   Fix #20: ES module — no global namespace pollution
   TauSu Guard KZ
   ============================================================ */

const i18n = {
  en: {
    'partner.label': 'Potential partners',
    'hero.tag':      'Kazakhstan · Safety Tech · 2025',
    'hero.tagline':  'No one left behind',
    'hero.sub':      "Real-time safety tracking for hikers, skiers, and outdoor adventurers across Kazakhstan's mountains.",
    'hero.btn1': '📍 View live demo', 'hero.scroll': 'Scroll',
    'stat1.num':'340+','stat1.label':'Mountain rescue incidents\nin Kazakhstan per year',
    'stat2.num':'73%', 'stat2.label':'Of incidents happen\nafter 16:00',
    'stat3.num':'4×',  'stat3.label':'Faster rescue with\nreal-time location sharing',
    'stat4.num':'0',   'stat4.label':'Dedicated hiker safety\nplatforms in KZ today',
    'prob.tag':'The Problem','prob.title':"Kazakhstan's mountains are beautiful — and dangerous",
    'prob.sub':"Ile-Alatau, Shymbulak, Charyn Canyon — millions of visitors every year. But when something goes wrong, rescue teams are blind.",
    'prob1.title':'Caught after dark',     'prob1.text':"Hikers underestimate sunset times. At high altitude temperatures drop 18°C after dark.",'prob1.stat':'73%','prob1.statlabel':'of incidents after 16:00',
    'prob2.title':'No signal, no help',    'prob2.text':"Cell coverage ends above 2,000m. Once in trouble there is no way to share location.",'prob2.stat':'61%','prob2.statlabel':'of rescues involve solo hikers',
    'prob3.title':'Unknown medical info',  'prob3.text':"Rescue teams have no access to blood type, allergies, or emergency contacts.",'prob3.stat':'2×','prob3.statlabel':'higher survival with pre-shared data',
    'prob4.title':'No centralized system', 'prob4.text':"No platform in Kazakhstan purpose-built for outdoor safety tracking.",'prob4.stat':'0','prob4.statlabel':'dedicated safety platforms in KZ',
    'hiw.tag':'How It Works','hiw.title':'Three steps to a safer hike',
    'hiw.sub':'TauSu Guard works seamlessly — for the hiker, and for the people responsible for their safety.',
    'step1.title':'Register before you go',  'step1.text':'Fill in your medical profile before starting.','step1.detail':'Takes under 2 minutes. Accessible to rescue teams instantly.',
    'step2.title':'Share your location',      'step2.text':'Enable GPS sharing. Position shown live on the admin map.','step2.detail':'Works on phone GPS. Satellite coming for zero-signal zones.',
    'step3.title':'AI monitors, alerts fire', 'step3.text':'If someone stops moving or bad weather hits — alerts fire automatically.','step3.detail':'Sunset countdowns, weather warnings, and SOS alerts.',
    'feat.tag':'Features','feat.title':'Everything a safety platform needs',
    'feat.sub':"Built specifically for Kazakhstan's outdoor environment.",
    'f1.title':'Live trail map','f1.text':'Every registered hiker shown as a live pin with trail, elevation, and status.',
    'f2.title':'Sunset countdown','f2.text':'Real-time countdown to sunset for each active hiking zone.',
    'f3.title':'Weather alerts','f3.text':'Automatic warnings when rain, wind, or temperature drops are forecast.',
    'f4.title':'Medical profiles','f4.text':'Blood type, allergies, and emergency contacts stored securely.',
    'f5.title':'Smart alerts','f5.text':'No movement for 30+ minutes? Alerts fire to the dashboard and emergency contact.',
    'f6.title':'Satellite GPS','f6.text':'Tracking for zero-signal zones via Garmin inReach and LoRa mesh networks.',
    'f7.title':'Swimmer safety zones','f7.text':'Kapchagai, Burabay and other lake zones mapped with safe and danger boundaries.',
    'f8.title':'Group hiking','f8.text':"Register as a group. Flags if anyone splits from the group's route.",
    'f9.title':'3 languages','f9.text':'Full support for English, Russian, and Kazakh.',
    'coming':'Coming soon',
    'cta.title':'Ready to see it in action?',
    'cta.sub':'Explore the live admin dashboard — real-time tracking, weather alerts, sunset countdowns, and medical profiles.',
    'cta.btn':'Open live dashboard →',
    'foot.tagline':'No one left behind · Kazakhstan · 2025',
    'foot.right':'Built for the mountains of Kazakhstan\nSolo founder · Early stage · Open to partnerships',
    'dash.home':'← Home','dash.register':'+ Register','dash.live':'Live tracking active',
    'panel.title':'Safety Dashboard','panel.sub':'Ile-Alatau National Park · Shymbulak trails · Almaty',
    'badge.alert1':'1 alert','badge.active':'18 active',
    'mc.hikers':'Active','mc.warnings':'Warnings','mc.alerts':'Alerts',
    'up.hikers':'Active users','up.hikers.sub':'18 registered today',
    // whitelisted for innerHTML — contains intentional <strong> tags
    'ai.msg':'<strong>Demo User A</strong> has not moved in 47 min at 3,200m. Sunset in 17 min — immediate descent required. <strong>Demo User D</strong> offline for 22 min at 2,900m.',
    'u1.sub':'Trail A · 3,200m · no movement 47 min','u2.sub':'Trail B · 2,600m · slow pace',
    'u3.sub':'Trail A · 2,100m · descending','u4.sub':'Trail C · 2,900m · offline',
    'u5.sub':'Trail D · 1,800m · ascending','u6.sub':'Trail B · 2,300m · on pace',
    'badge.alert':'Alert','badge.warn':'Warn','badge.safe':'Safe','badge.offline':'Offline',
    'med.btn':'Med info',
    'reg.title':'🏔️ Register','reg.s1':'Personal details',
    'reg.fname':'First name','reg.fname.ph':'e.g. Asel',
    'reg.lname':'Last name', 'reg.lname.ph':'e.g. Seitkali',
    'reg.age':'Age','reg.age.ph':'28','reg.phone':'Phone','reg.phone.ph':'+7 700 000 0000',
    'reg.trail':'Trail','reg.trail.ph':'Select a trail',
    'reg.t1':'Trail A · Summit (3,200m)','reg.t2':'Trail B · Shymbulak (3,450m)',
    'reg.t3':'Trail C · East Ridge','reg.t4':'Trail D · Valley Loop',
    'reg.duration':'Journey duration',
    'reg.s2':'Blood type','reg.s3':'Allergies',
    'reg.allergy.hint':'Select all that apply, or type below',
    'reg.allergy.other':'Other allergies or medical conditions','reg.allergy.ph':'e.g. asthma, diabetes...',
    'reg.s4':'SOS / Emergency contact',
    'reg.sos.name':'Contact name','reg.sos.name.ph':'e.g. Daulet Seitkali',
    'reg.sos.rel':'Relationship','reg.sos.rel.ph':'e.g. Brother',
    'reg.sos.phone':'Contact phone','reg.sos.phone2':'Secondary contact (optional)',
    'reg.submit':'✓  Register & save medical info',
    'reg.success.h':'Registered!',
    // whitelisted for innerHTML — contains intentional <br> tags
    'reg.success.p':'Your medical profile has been saved and is now available to rescue teams on the admin dashboard.<br><br>You will appear in the active users list once location sharing is enabled.',
    'reg.done':'Done',
    'med.age':'Age','med.blood':'Blood type','med.allergy':'⚠ Allergies','med.sos':'📞 SOS / Emergency contact',
    'err.fname':'Please enter your first name.',
    'err.lname':'Please enter your last name.',
    'err.phone':'Please enter a valid phone number (e.g. +7 700 123 4567).',
    'err.age':'Please enter a valid age between 1 and 120.',
    'err.trail':'Please select a trail.',
    'err.duration':'Please select a journey duration.',
    'err.sos':'Please enter an emergency contact phone number.',
    'err.signin.phone':'Please enter your phone number.',
    'err.signin.pass':'Please enter your password.',
    'online.label':'online','weak.label':'weak signal','offlineLong.label':'offline (>15 min)',
  },

  ru: {
    'partner.label':'Потенциальные партнёры',
    'hero.tag':'Казахстан · Технологии безопасности · 2025',
    'hero.tagline':'Никто не будет забыт',
    'hero.sub':'Отслеживание безопасности в реальном времени для туристов в горах Казахстана.',
    'hero.btn1':'📍 Открыть демо','hero.scroll':'Листать',
    'stat1.num':'340+','stat1.label':'Горноспасательных операций\nв Казахстане в год',
    'stat2.num':'73%','stat2.label':'Происшествий случается\nпосле 16:00',
    'stat3.num':'4×','stat3.label':'Быстрее спасение при\nотслеживании местоположения',
    'stat4.num':'0','stat4.label':'Платформ безопасности\nдля туристов в Казахстане',
    'prob.tag':'Проблема','prob.title':'Горы Казахстана прекрасны — и опасны',
    'prob.sub':'Иле-Алатау, Шымбулак, Чарын — миллионы посетителей. Но когда что-то идёт не так, спасатели слепы.',
    'prob1.title':'Застигнутые темнотой','prob1.text':'Туристы недооценивают время захода солнца.','prob1.stat':'73%','prob1.statlabel':'происшествий после 16:00',
    'prob2.title':'Нет сигнала — нет помощи','prob2.text':'Покрытие заканчивается выше 2000м.','prob2.stat':'61%','prob2.statlabel':'вызовов — одиночные туристы',
    'prob3.title':'Неизвестные медданные','prob3.text':'Спасатели не знают группу крови и аллергии.','prob3.stat':'2×','prob3.statlabel':'выше выживаемость с медданными',
    'prob4.title':'Нет единой системы','prob4.text':'Нет платформы для безопасности на природе.','prob4.stat':'0','prob4.statlabel':'специализированных платформ в КЗ',
    'hiw.tag':'Как это работает','hiw.title':'Три шага к безопасному походу',
    'hiw.sub':'TauSu Guard работает бесперебойно — для туриста и для тех, кто отвечает за его безопасность.',
    'step1.title':'Зарегистрируйтесь','step1.text':'Заполните медицинский профиль перед походом.','step1.detail':'Занимает менее 2 минут. Мгновенно доступно спасателям.',
    'step2.title':'Поделитесь местоположением','step2.text':'Включите GPS. Позиция на карте администратора.','step2.detail':'Спутниковая интеграция — скоро.',
    'step3.title':'ИИ мониторит','step3.text':'Оповещения срабатывают автоматически при остановке.','step3.detail':'Обратный отсчёт до заката и SOS-оповещения.',
    'feat.tag':'Функции','feat.title':'Всё необходимое для платформы безопасности',
    'feat.sub':'Создано специально для природной среды Казахстана.',
    'f1.title':'Карта маршрутов онлайн','f1.text':'Подробные карты Иле-Алатау и Шымбулака.',
    'f2.title':'Обратный отсчёт до заката','f2.text':'Отсчёт до захода солнца для каждой активной зоны.',
    'f3.title':'Погодные предупреждения','f3.text':'Предупреждения при прогнозе дождя или похолодания.',
    'f4.title':'Медицинские профили','f4.text':'Группа крови, аллергии и экстренные контакты хранятся надёжно.',
    'f5.title':'Умные оповещения','f5.text':'Нет движения 30+ минут? Автоматические оповещения.',
    'f6.title':'Спутниковый GPS','f6.text':'Отслеживание для зон без сигнала.',
    'f7.title':'Зоны безопасности для пловцов','f7.text':'Капчагай, Бурабай и другие озёра.',
    'f8.title':'Групповой поход','f8.text':'Регистрируйтесь как группа с руководителем.',
    'f9.title':'3 языка','f9.text':'Поддержка английского, русского и казахского.',
    'coming':'Скоро',
    'cta.title':'Хотите увидеть в действии?','cta.sub':'Откройте панель администратора.','cta.btn':'Открыть панель →',
    'foot.tagline':'Никто не будет забыт · Казахстан · 2025','foot.right':'Создано для гор Казахстана\nОдин основатель · Ранняя стадия',
    'dash.home':'← Главная','dash.register':'+ Зарегистрироваться','dash.live':'Отслеживание активно',
    'panel.title':'Панель безопасности','panel.sub':'НП Иле-Алатау · Маршруты Шымбулака · Алматы',
    'badge.alert1':'1 тревога','badge.active':'18 активных',
    'mc.hikers':'Активных','mc.warnings':'Предупреждений','mc.alerts':'Тревог',
    'up.hikers':'Активные пользователи','up.hikers.sub':'18 зарегистрировано сегодня',
    'ai.msg':'<strong>Демо А</strong> не двигается 47 мин на высоте 3200м. <strong>Демо Г</strong> офлайн 22 мин на высоте 2900м.',
    'u1.sub':'Маршрут А · 3200м · нет движения 47 мин','u2.sub':'Маршрут Б · 2600м · медленный темп',
    'u3.sub':'Маршрут А · 2100м · спускается','u4.sub':'Маршрут В · 2900м · офлайн',
    'u5.sub':'Маршрут Г · 1800м · поднимается','u6.sub':'Маршрут Б · 2300м · в графике',
    'badge.alert':'Тревога','badge.warn':'Внимание','badge.safe':'Безопасно','badge.offline':'Офлайн',
    'med.btn':'Мед. инфо',
    'reg.title':'🏔️ Регистрация','reg.s1':'Личные данные',
    'reg.fname':'Имя','reg.fname.ph':'напр. Асель','reg.lname':'Фамилия','reg.lname.ph':'напр. Сейткали',
    'reg.age':'Возраст','reg.age.ph':'28','reg.phone':'Телефон','reg.phone.ph':'+7 700 000 0000',
    'reg.trail':'Маршрут','reg.trail.ph':'Выберите маршрут',
    'reg.t1':'Маршрут А · Вершина (3200м)','reg.t2':'Маршрут Б · Шымбулак (3450м)',
    'reg.t3':'Маршрут В · Вост. хребет','reg.t4':'Маршрут Г · Долинный круг',
    'reg.duration':'Длительность похода',
    'reg.s2':'Группа крови','reg.s3':'Аллергии',
    'reg.allergy.hint':'Выберите все подходящие или введите ниже',
    'reg.allergy.other':'Другие аллергии или заболевания','reg.allergy.ph':'напр. астма, диабет...',
    'reg.s4':'SOS / Экстренный контакт',
    'reg.sos.name':'Имя контакта','reg.sos.name.ph':'напр. Даулет Сейткали',
    'reg.sos.rel':'Родство','reg.sos.rel.ph':'напр. Брат',
    'reg.sos.phone':'Телефон контакта','reg.sos.phone2':'Доп. контакт (необязательно)',
    'reg.submit':'✓  Зарегистрировать и сохранить медданные',
    'reg.success.h':'Регистрация успешна!',
    'reg.success.p':'Медицинский профиль сохранён и доступен спасателям.<br><br>Вы появитесь в списке активных после включения геолокации.',
    'reg.done':'Готово',
    'med.age':'Возраст','med.blood':'Группа крови','med.allergy':'⚠ Аллергии','med.sos':'📞 SOS / Экстренный контакт',
    'err.fname':'Введите имя.','err.lname':'Введите фамилию.',
    'err.phone':'Введите корректный номер телефона.','err.age':'Введите корректный возраст (1–120).',
    'err.trail':'Выберите маршрут.','err.duration':'Выберите длительность похода.',
    'err.sos':'Введите телефон экстренного контакта.',
    'err.signin.phone':'Введите номер телефона.','err.signin.pass':'Введите пароль.',
    'online.label':'онлайн','weak.label':'слабый сигнал','offlineLong.label':'офлайн (>15 мин)',
  },

  kz: {
    'partner.label':'Ықтимал серіктестер',
    'hero.tag':'Қазақстан · Қауіпсіздік технологиясы · 2025',
    'hero.tagline':'Ешкім ұмытылмайды',
    'hero.sub':'Қазақстан тауларындағы жаяу серуеншілер үшін нақты уақытта қауіпсіздікті бақылау.',
    'hero.btn1':'📍 Демоны ашу','hero.scroll':'Айналдыру',
    'stat1.num':'340+','stat1.label':'Қазақстандағы таулы\nқұтқару операциялары',
    'stat2.num':'73%','stat2.label':'Оқиғалар 16:00-ден\nкейін болады',
    'stat3.num':'4×','stat3.label':'Орналасу деректерімен\nқұтқару жылдамдығы',
    'stat4.num':'0','stat4.label':'Қазақстандағы арнайы\nқауіпсіздік платформасы',
    'prob.tag':'Мәселе','prob.title':'Қазақстан тауларыекі жақты: әдемі — және қауіпті',
    'prob.sub':'Іле-Алатау, Шымбұлақ, Шарын — жыл сайын миллиондаған келушілер.',
    'prob1.title':'Қараңғыда қалу','prob1.text':'Жаяу серуеншілер күн батуын бағаламайды.','prob1.stat':'73%','prob1.statlabel':'оқиғалар 16:00-ден кейін',
    'prob2.title':'Байланыс жоқ','prob2.text':'Ұялы байланыс 2000м-ден жоғарыда үзіледі.','prob2.stat':'61%','prob2.statlabel':'жеке серуеншілерге қатысты',
    'prob3.title':'Медициналық деректер белгісіз','prob3.text':'Зардап шеккен табылғанда, қан тобына қол жеткізуі мүмкін емес.','prob3.stat':'2×','prob3.statlabel':'медициналық деректермен тірі қалу',
    'prob4.title':'Орталықтандырылған жүйе жоқ','prob4.text':'Қазақстанда табиғат қауіпсіздігіне арналған платформа жоқ.','prob4.stat':'0','prob4.statlabel':'арнайы қауіпсіздік платформасы',
    'hiw.tag':'Қалай жұмыс істейді','hiw.title':'Қауіпсіз серуенге үш қадам',
    'hiw.sub':'TauSu Guard үздіксіз жұмыс істейді.',
    'step1.title':'Жолға шықпас бұрын тіркеліңіз','step1.text':'Медициналық профильді толтырыңыз.','step1.detail':'2 минуттан аз уақыт кетеді.',
    'step2.title':'Орналасуыңызды бөлісіңіз','step2.text':'GPS бөлісуді қосыңыз.','step2.detail':'Телефон GPS-пен жұмыс істейді.',
    'step3.title':'Жасанды интеллект бақылайды','step3.text':'Ескертулер автоматты түрде іске қосылады.','step3.detail':'Күн батуына кері санақ және SOS.',
    'feat.tag':'Мүмкіндіктер','feat.title':'Қауіпсіздік платформасына қажеттінің бәрі',
    'feat.sub':'Қазақстанның табиғи ортасы үшін арнайы жасалған.',
    'f1.title':'Тікелей маршрут картасы','f1.text':'Іле-Алатау және Шымбұлақтың карталары.',
    'f2.title':'Күн батуына кері санақ','f2.text':'Нақты уақыт санақ.',
    'f3.title':'Ауа-райы ескертулері','f3.text':'Ауа-райы деректері.',
    'f4.title':'Медициналық профильдер','f4.text':'Қан тобы және аллергиялар қауіпсіз сақталады.',
    'f5.title':'Ақылды ескертулер','f5.text':'30+ минут қозғалмаса — ескертулер.',
    'f6.title':'Жерсерік GPS','f6.text':'Сигналсыз аймақтар үшін бақылау.',
    'f7.title':'Жүзушілер қауіпсіздік аймақтары','f7.text':'Қапшағай, Бурабай және басқа көлдер.',
    'f8.title':'Топтық серуен','f8.text':'Топ жетекшісімен тіркеліңіз.',
    'f9.title':'3 тіл','f9.text':'Ағылшын, орыс және қазақ тілдері.',
    'coming':'Жақында',
    'cta.title':'Іс жүзінде көргіңіз келе ме?','cta.sub':'Тікелей панелді зерттеңіз.','cta.btn':'Панелді ашу →',
    'foot.tagline':'Ешкім ұмытылмайды · Қазақстан · 2025','foot.right':'Қазақстан таулары үшін жасалған\nЖалғыз негізші · Ерте кезең',
    'dash.home':'← Басты бет','dash.register':'+ Тіркелу','dash.live':'Бақылау белсенді',
    'panel.title':'Қауіпсіздік панелі','panel.sub':'Іле-Алатау ҰП · Шымбұлақ маршруттары · Алматы',
    'badge.alert1':'1 дабыл','badge.active':'18 белсенді',
    'mc.hikers':'Белсенді','mc.warnings':'Ескертулер','mc.alerts':'Дабылдар',
    'up.hikers':'Белсенді пайдаланушылар','up.hikers.sub':'Бүгін 18 тіркелді',
    'ai.msg':'<strong>Демо А</strong> 3200м биіктікте 47 минут қозғалмаған. <strong>Демо Г</strong> 2900м биіктікте 22 минут офлайн.',
    'u1.sub':'А маршруты · 3200м · 47 мин қозғалыс жоқ','u2.sub':'Б маршруты · 2600м · баяу қарқын',
    'u3.sub':'А маршруты · 2100м · түсуде','u4.sub':'В маршруты · 2900м · офлайн',
    'u5.sub':'Г маршруты · 1800м · көтерілуде','u6.sub':'Б маршруты · 2300м · кестеде',
    'badge.alert':'Дабыл','badge.warn':'Ескерту','badge.safe':'Қауіпсіз','badge.offline':'Офлайн',
    'med.btn':'Мед. ақпарат',
    'reg.title':'🏔️ Тіркелу','reg.s1':'Жеке деректер',
    'reg.fname':'Аты','reg.fname.ph':'мыс. Асель','reg.lname':'Тегі','reg.lname.ph':'мыс. Сейткали',
    'reg.age':'Жасы','reg.age.ph':'28','reg.phone':'Телефон','reg.phone.ph':'+7 700 000 0000',
    'reg.trail':'Маршрут','reg.trail.ph':'Маршрутты таңдаңыз',
    'reg.t1':'А маршруты · Шың (3200м)','reg.t2':'Б маршруты · Шымбұлақ (3450м)',
    'reg.t3':'В маршруты · Шығыс жотасы','reg.t4':'Г маршруты · Алқап шеңбері',
    'reg.duration':'Жорықтың ұзақтығы',
    'reg.s2':'Қан тобы','reg.s3':'Аллергиялар',
    'reg.allergy.hint':'Барлық қолданыстыны таңдаңыз немесе жазыңыз',
    'reg.allergy.other':'Басқа аллергиялар немесе аурулар','reg.allergy.ph':'мыс. демікпе, қант диабеті...',
    'reg.s4':'SOS / Шұғыл байланыс',
    'reg.sos.name':'Байланыс аты','reg.sos.name.ph':'мыс. Даулет Сейткали',
    'reg.sos.rel':'Туыстық','reg.sos.rel.ph':'мыс. Аға',
    'reg.sos.phone':'Байланыс телефоны','reg.sos.phone2':'Қосымша байланыс (міндетті емес)',
    'reg.submit':'✓  Тіркеу және медициналық деректерді сақтау',
    'reg.success.h':'Тіркелді!',
    'reg.success.p':'Медициналық профиль сақталды.<br><br>Геолокация қосылғаннан кейін тізімде пайда болады.',
    'reg.done':'Дайын',
    'med.age':'Жасы','med.blood':'Қан тобы','med.allergy':'⚠ Аллергиялар','med.sos':'📞 SOS / Шұғыл байланыс',
    'err.fname':'Атыңызды енгізіңіз.','err.lname':'Тегіңізді енгізіңіз.',
    'err.phone':'Жарамды телефон нөмірін енгізіңіз.','err.age':'Жарамды жасты енгізіңіз (1–120).',
    'err.trail':'Маршрутты таңдаңыз.','err.duration':'Жорықтың ұзақтығын таңдаңыз.',
    'err.sos':'Шұғыл байланыс телефонын енгізіңіз.',
    'err.signin.phone':'Телефон нөмірін енгізіңіз.','err.signin.pass':'Құпия сөзді енгізіңіз.',
    'online.label':'онлайн','weak.label':'әлсіз сигнал','offlineLong.label':'офлайн (>15 мин)',
  },
};

// Keys allowed to write innerHTML — must contain intentional HTML only
const HTML_KEYS = new Set(['ai.msg', 'reg.success.p']);

const DOM_MAP = [
  ['#partner-label','partner.label'],
  ['#hero-tag-text','hero.tag'],['#hero-tagline','hero.tagline'],['#hero-sub','hero.sub'],
  ['#hero-btn1','hero.btn1'],['#hero-scroll','hero.scroll'],
  ['#stat1-num','stat1.num'],['#stat1-label','stat1.label'],['#stat2-num','stat2.num'],['#stat2-label','stat2.label'],
  ['#stat3-num','stat3.num'],['#stat3-label','stat3.label'],['#stat4-num','stat4.num'],['#stat4-label','stat4.label'],
  ['#prob-tag','prob.tag'],['#prob-title','prob.title'],['#prob-sub','prob.sub'],
  ['#prob1-title','prob1.title'],['#prob1-text','prob1.text'],['#prob1-stat','prob1.stat'],['#prob1-statlabel','prob1.statlabel'],
  ['#prob2-title','prob2.title'],['#prob2-text','prob2.text'],['#prob2-stat','prob2.stat'],['#prob2-statlabel','prob2.statlabel'],
  ['#prob3-title','prob3.title'],['#prob3-text','prob3.text'],['#prob3-stat','prob3.stat'],['#prob3-statlabel','prob3.statlabel'],
  ['#prob4-title','prob4.title'],['#prob4-text','prob4.text'],['#prob4-stat','prob4.stat'],['#prob4-statlabel','prob4.statlabel'],
  ['#hiw-tag','hiw.tag'],['#hiw-title','hiw.title'],['#hiw-sub','hiw.sub'],
  ['#step1-title','step1.title'],['#step1-text','step1.text'],['#step1-detail','step1.detail'],
  ['#step2-title','step2.title'],['#step2-text','step2.text'],['#step2-detail','step2.detail'],
  ['#step3-title','step3.title'],['#step3-text','step3.text'],['#step3-detail','step3.detail'],
  ['#feat-tag','feat.tag'],['#feat-title','feat.title'],['#feat-sub','feat.sub'],
  ['#f1-title','f1.title'],['#f1-text','f1.text'],['#f2-title','f2.title'],['#f2-text','f2.text'],
  ['#f3-title','f3.title'],['#f3-text','f3.text'],['#f4-title','f4.title'],['#f4-text','f4.text'],
  ['#f5-title','f5.title'],['#f5-text','f5.text'],['#f6-title','f6.title'],['#f6-text','f6.text'],
  ['#f7-title','f7.title'],['#f7-text','f7.text'],['#f8-title','f8.title'],['#f8-text','f8.text'],
  ['#f9-title','f9.title'],['#f9-text','f9.text'],
  ['#coming1','coming'],['#coming2','coming'],['#coming3','coming'],
  ['#cta-title','cta.title'],['#cta-sub','cta.sub'],['#cta-btn','cta.btn'],
  ['#foot-tagline','foot.tagline'],['#foot-right','foot.right'],
  ['#btn-home','dash.home'],['#btn-register','dash.register'],['#dash-live','dash.live'],
  ['#panel-hiker-title','panel.title'],['#panel-hiker-sub','panel.sub'],
  ['#badge-alert1','badge.alert1'],['#badge-active18','badge.active'],
  ['#mc-hikers','mc.hikers'],['#mc-warnings','mc.warnings'],['#mc-alerts','mc.alerts'],
  ['#up-hikers','up.hikers'],['#up-hikers-sub','up.hikers.sub'],
  ['#ai-msg','ai.msg'],
  ['#u1-sub','u1.sub'],['#u2-sub','u2.sub'],['#u3-sub','u3.sub'],
  ['#u4-sub','u4.sub'],['#u5-sub','u5.sub'],['#u6-sub','u6.sub'],
  ['#badge-u1','badge.alert'],['#badge-u2','badge.warn'],
  ['#badge-u3','badge.safe'],['#badge-u4','badge.offline'],['#badge-u5','badge.safe'],['#badge-u6','badge.safe'],
  ['#med-u1','med.btn'],['#med-u2','med.btn'],['#med-u3','med.btn'],
  ['#med-u4','med.btn'],['#med-u5','med.btn'],['#med-u6','med.btn'],
  ['#reg-modal-title','reg.title'],['#reg-s1','reg.s1'],
  ['#reg-fname-label','reg.fname'],['#reg-lname-label','reg.lname'],
  ['#reg-age-label','reg.age'],['#reg-phone-label','reg.phone'],
  ['#reg-trail-label','reg.trail'],['#reg-duration-label','reg.duration'],
  ['#reg-s2','reg.s2'],['#reg-s3','reg.s3'],
  ['#reg-allergy-hint','reg.allergy.hint'],['#reg-allergy-other-label','reg.allergy.other'],
  ['#reg-s4','reg.s4'],
  ['#reg-sos-name-label','reg.sos.name'],['#reg-sos-rel-label','reg.sos.rel'],
  ['#reg-sos-phone-label','reg.sos.phone'],['#reg-sos-phone2-label','reg.sos.phone2'],
  ['#reg-submit-btn','reg.submit'],
  ['#reg-success-h','reg.success.h'],['#reg-success-p','reg.success.p'],
  ['#reg-done-btn','reg.done'],
  ['#med-age-label','med.age'],['#med-blood-label','med.blood'],
  ['#med-allergy-label','med.allergy'],['#med-sos-label','med.sos'],
];

const PLACEHOLDER_MAP = [
  ['#r-fname','reg.fname.ph'],['#r-lname','reg.lname.ph'],
  ['#r-age','reg.age.ph'],['#r-phone','reg.phone.ph'],
  ['#r-sos-name','reg.sos.name.ph'],['#r-sos-rel','reg.sos.rel.ph'],
];

const TRAIL_OPT_KEYS = ['reg.trail.ph','reg.t1','reg.t2','reg.t3','reg.t4'];

export let currentLang = 'en';

export function applyLang(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  // Fix #2: kz uses 'kk' as HTML lang code (ISO 639-1)
  document.documentElement.lang = lang === 'kz' ? 'kk' : lang;
  const t = i18n[lang];

  DOM_MAP.forEach(([sel, key]) => {
    const el = document.querySelector(sel);
    if (!el || t[key] === undefined) return;
    // Fix #3: only whitelisted keys use innerHTML
    if (HTML_KEYS.has(key)) { el.innerHTML = t[key]; }
    else { el.textContent = t[key]; }
  });

  PLACEHOLDER_MAP.forEach(([sel, key]) => {
    const el = document.querySelector(sel);
    if (el && t[key]) el.placeholder = t[key];
  });

  const trailSel = document.getElementById('r-trail');
  if (trailSel) {
    trailSel.querySelectorAll('option').forEach((opt, i) => {
      const key = TRAIL_OPT_KEYS[i];
      if (key && t[key]) opt.textContent = t[key];
    });
  }

  // Partner banner — last word highlighted via createElement (no innerHTML)
  const pl = document.getElementById('partner-label');
  if (pl && t['partner.label']) {
    const words = t['partner.label'].split(' ');
    const last  = words.pop();
    while (pl.firstChild) pl.removeChild(pl.firstChild);
    if (words.length) {
      pl.appendChild(document.createTextNode(words.join(' ') + ' '));
    }
    const span = document.createElement('span');
    span.textContent = last;
    pl.appendChild(span);
  }

  document.querySelectorAll('.lb').forEach(b => {
    const active = b.textContent === lang.toUpperCase();
    b.classList.toggle('on', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

// Convenience getter for other modules
export function t(key) {
  return i18n[currentLang]?.[key] ?? i18n.en[key] ?? key;
}
