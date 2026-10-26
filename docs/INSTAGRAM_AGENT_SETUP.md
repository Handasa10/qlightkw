# وكيل الإنستجرام – دليل التشغيل

الوكيل بيرد على كومنتات صفحة **@quality_light1** كخبير إضاءة: بيقرا الكومنت ووصف البوست وملف معرفة كواليتي لايت، ويقرر يرد أو يوقف الكومنت للمراجعة أو يتجاهله.

- الكود: `supabase/functions/instagram-agent/`
- الجداول: `ig_agent_settings` و `ig_agent_secrets` و `ig_comments`، في الـ migration `20261026120000_instagram_comment_agent.sql`.
- لوحة التحكم: `/admin/instagram-agent`

## إزاي بيشتغل

1. حد يكتب كومنت، فـ Meta تبعت **Webhook** فوري للوكيل. وفيه كمان فحص احتياطي كل 5 دقايق بيلقط أي كومنت فات.
2. الوكيل يصنّف الكومنت ويكتب الرد باستخدام Claude:

| النوع | التصرف |
|---|---|
| سؤال فني، أو مكان وتواصل، أو مديح | رد خبير قصير باللهجة الكويتية |
| سؤال سعر | رد بيحوّله للخاص أو الواتساب، ومن غير أسعار |
| شكوى، أو موضوع حساس، أو حاجة مش متأكد منها | يوقف الكومنت في "محتاج مراجعة" ومعاه مسودة رد |
| سبام أو إعلانات | يتجاهله |

3. **طرق النشر:**
   - **مختلط** (الافتراضي): ينشر الردود العادية لوحده، ويوقف الحساس.
   - **موافقة على الكل**: كل رد يستنى موافقتك.
   - **تلقائي**: ينشر كل حاجة ما عدا الشكاوى.
4. بيرد بس على الكومنتات اللي تتكتب **بعد** ما تشغّله، وعمره ما بيرد مرتين على نفس الكومنت.

## خطوات الإعداد (مرة واحدة)

### 1) حساب الإنستجرام
- الحساب لازم يكون **Professional**، يعني Business أو Creator.
- من التطبيق: الإعدادات ← Account type and tools ← Switch to professional account.

### 2) تطبيق Meta
1. ادخل على [developers.facebook.com](https://developers.facebook.com)، وبعدين **My Apps** ← **Create App**.
2. اختار الاستخدام: **Manage messaging & content on Instagram** (Instagram API).
3. من القائمة: **Instagram** ← **API setup with Instagram business login**.
4. في **Generate access tokens** دوس **Add account**، وادخل بحساب @quality_light1 ووافق على الصلاحيات:
   - `instagram_business_basic`
   - `instagram_business_manage_comments`
5. انسخ الـ **Access Token** اللي هيظهر، وبيبدأ غالبًا بـ `IGAA`.
6. من نفس الصفحة انسخ **Instagram app secret**.

> لو ظهرلك إن الحساب محتاج يكون Tester:
> - من **App roles ← Roles** ضيف الحساب كـ **Instagram Tester**.
> - بعدين من الإنستجرام: الإعدادات ← Website permissions ← Apps and websites ← Tester invites، ووافق على الدعوة.

### 3) مفاتيح السيرفر (Secrets)
من Supabase أو Lovable Cloud: **Edge Functions ← Secrets**، ضيف التلات مفاتيح دول:

| الاسم | القيمة |
|---|---|
| `ANTHROPIC_API_KEY` | مفتاح Claude من [console.anthropic.com](https://console.anthropic.com)، من صفحة API Keys |
| `IG_APP_SECRET` | الـ Instagram app secret من الخطوة 2 |
| `IG_VERIFY_TOKEN` | أي كلمة سر تختارها إنت، مثلًا `qlight-ig-2026`، وهتستخدمها تاني في الخطوة 4 |

### 4) ربط الـ Webhook
في صفحة **API setup with Instagram business login**، جزء **Configure webhooks**:
- **Callback URL:**
  `https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/instagram-agent`
- **Verify token:** نفس قيمة `IG_VERIFY_TOKEN`.
- دوس **Verify and save**، وبعدين اشترك في الحقل **comments**، وفعّل الـ Webhook subscription للحساب.

### 5) تشغيل الوكيل
1. ادخل لوحة الأدمن ← **وكيل الإنستجرام** ← **الإعدادات**.
2. الصق الـ Access Token ودوس **اربط**. هيظهر اسم الحساب.
3. اختار طريقة النشر (ننصح بـ **مختلط**)، ولو عايز اكتب قواعد إضافية، زي عرض الأسبوع.
4. افتح تبويب **تجربة** وجرّب كومنتات: سؤال فني، وسؤال سعر، وشكوى. اتأكد إن الردود عاجباك.
5. فعّل **الوكيل شغّال** ودوس **حفظ**.

## ملاحظات

- **الردود متأخرة 5 دقايق بدل ما تكون فورية؟** يبقى الـ Webhook مش واصل. ده بيحصل غالبًا والتطبيق لسه في **Development mode**. الحل:
  - حط رابط سياسة الخصوصية: `https://qlightkw.lovable.app/privacy`.
  - حوّل التطبيق لـ **Live** من أعلى صفحة التطبيق.
  - لحد ما تعمل ده، الفحص كل 5 دقايق بيغطي.
- **التوكن** صالح 60 يوم، والوكيل بيجدده تلقائيًا كل أسبوع. لو وقف لأي سبب، اعمل توكن جديد والصقه.
- **التكلفة التقريبية:** حوالي 1–2 سنت لكل كومنت على Claude، يعني تقريبًا 10–20 دولار لكل ألف كومنت.
- **ملف المعرفة:** تقدر تعدّله من الإعدادات (الخدمات، والنصايح الفنية، والسياسات). لو سبته فاضي، بيستخدم الملف الجاهز.
- **الموديل:** الافتراضي `claude-opus-5-5`. تقدر تغيّره بـ Secret اسمه `IG_AGENT_MODEL`.
