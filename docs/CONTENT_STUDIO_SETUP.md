# استوديو المحتوى الأوتوماتيكي — خطوات التشغيل

المنظومة: جلسات Claude مجدولة في السحابة بتقترح المواضيع، وتكتب السكريبتات، وتعمل الريلز والبوستات.
أنت بتوافق على كل خطوة من بوت تليجرام **QL Studio**، والدالة `content-studio` على Supabase بتجدول وتنشر على
انستجرام وفيسبوك في المواعيد: ريلز 9:00 · 14:00 · 18:00، وبوستات صور 11:30 · 20:30 (بتوقيت الكويت).

> ⚠️ ما تبعتش أي توكن أو مفتاح في الشات. كل المفاتيح بتتحط في أماكنها بس (Supabase Secrets / إعدادات بيئة Claude).

## 1) قاعدة البيانات
Supabase ← SQL Editor ← الصق محتوى الملف ده كله واضغط Run:
`supabase/migrations/20261029090000_content_studio.sql`

## 2) الدالة
Edge Functions ← Deploy a new function ← Via Editor ← الاسم `content-studio` ← الصق محتوى
`supabase/functions/content-studio/index.ts` ← Deploy. بعدها من إعدادات الدالة اقفل **Verify JWT**.

## 3) بوت تليجرام جديد للاستوديو
- في تليجرام افتح @BotFather ← `/newbot` ← سمّيه مثلًا `QL Studio`.
- خد التوكن وحطه في Supabase ← Edge Functions ← Secrets باسم `STUDIO_TELEGRAM_BOT_TOKEN`.
- بعد 5 دقايق (أول تشغيل للكرون) افتح البوت واضغط `/start`. أول واحد يضغط بيبقى صاحب البوت.

## 4) مفتاح الاستوديو
اعمل كلمة سر طويلة عشوائية (40 حرف مثلًا) وحطها في Supabase Secrets باسم `STUDIO_TOKEN`.
نفس القيمة هتتحط كمان في إعدادات بيئة Claude (خطوة 7).

## 5) صلاحية النشر على انستجرام
- Meta for Developers ← تطبيقك ← Use cases ← Instagram API ← Permissions: ضيف `instagram_business_content_publish`.
- اعمل Generate token من جديد لحساب quality_light1.
- حدّث التوكن بنفس الطريقة اللي عملناها قبل كده (من غير ما تبعته في الشات):
  ```sql
  update public.ig_agent_secrets set access_token = 'التوكن_الجديد', updated_at = now() where id = 1;
  ```

## 6) صلاحية النشر على صفحة فيسبوك
- Graph API Explorer ← نفس التطبيق ← User token بالصلاحيات:
  `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
- حوّله لتوكن طويل المدة (Access Token Debugger ← Extend Access Token).
- في الـ Explorer نفّذ `me/accounts` بالتوكن الطويل، وخد `access_token` و`id` بتوع صفحة كواليتي لايت.
  توكن الصفحة اللي بيطلع من توكن طويل المدة ما بيخلصش.
- حطهم في Supabase Secrets: `FB_PAGE_ACCESS_TOKEN` و`FB_PAGE_ID`.

## 7) إعدادات بيئة Claude (عشان الجلسات المجدولة تشتغل لوحدها)
من قائمة البيئة في عنوان الجلسة ← Edit:
- **Network access**: ضيف الدومين `yubebbfsmlopmnluajgf.supabase.co` في Allowed domains.
- **Environment variables**:
  - `STUDIO_TOKEN` = نفس قيمة خطوة 4
  - `GOOGLE_AI_API_KEY` = مفتاح Google AI Studio
  - `GEMINI_TTS_VOICE` = اسم الصوت اللي بتستخدمه في AI Studio (مثلًا Charon)

## 8) الجدولة
بعد ما الخطوات دي تخلص، Claude بيعمل المهام المجدولة:
- **جلسة الأفكار والسكريبتات**: كل يوم الصبح.
- **جلسة الإنتاج**: كل يوم بالليل. بتعمل الريلز والبوستات اللي سكريبتاتها اتوافق عليها، وتبعتها لك على تليجرام.

## أوامر البوت
`/pending` المستني موافقتك · `/queue` المجدول · `/status` ملخص · `/pause` و`/resume` إيقاف وتشغيل النشر.
عشان تطلب تعديل على أي فكرة أو سكريبت أو فيديو: اعمل **Reply** على رسالته واكتب ملاحظاتك.
