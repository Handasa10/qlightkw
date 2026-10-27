# وكيل الإنستجرام – التشغيل المختصر

الوكيل بيرد على كومنتات **@quality_light1** كخبير إضاءة. بيدوّر على الكومنتات الجديدة كل دقيقتين، فمش محتاج إعداد Webhook. وبيكتب الردود بمفتاح Gemini الموجود أصلًا في المتجر، فمش محتاج أي مفتاح جديد.

- الكود: `supabase/functions/instagram-agent/`
- الجداول: `20261026120000_instagram_comment_agent.sql`
- لوحة التحكم: `/admin/instagram-agent`

## المطلوب: 3 خطوات بس

### 1) توكن الإنستجرام (حوالي 10 دقايق)
1. ادخل على [developers.facebook.com/apps](https://developers.facebook.com/apps) ← **Create App**.
2. اختار **Manage messaging & content on Instagram**.
3. افتح **Instagram ← API setup with Instagram business login**.
4. في **Generate access tokens** دوس **Add account**، وادخل بحساب @quality_light1، ووافق.
5. انسخ التوكن اللي هيظهر (بيبدأ بـ `IGAA`).

> لو طلب إن الحساب يكون Tester:
> - من **App roles ← Roles** ضيف @quality_light1 كـ Instagram Tester.
> - من الإنستجرام: الإعدادات ← Website permissions ← Apps and websites ← Tester invites، ووافق.

### 2) تنزيل الوكيل على السيرفر (رسالة واحدة لـ Lovable)
بعد ما الكود يتدمج في `main`، الصق الرسالة دي في Lovable:

```
Please apply the database migration in supabase/migrations/20261026120000_instagram_comment_agent.sql
and deploy the edge function supabase/functions/instagram-agent (verify_jwt = false, already set in supabase/config.toml).
Do not change any code.
```

### 3) الربط والتشغيل
1. لوحة الأدمن ← **وكيل الإنستجرام** ← **الإعدادات**.
2. الصق التوكن ودوس **اربط**.
3. من تبويب **تجربة** جرّب كام كومنت.
4. فعّل **الوكيل شغّال** ودوس **حفظ**.

## إضافات اختيارية (بعدين)
- **ردود أقوى:** ضيف Secret اسمه `ANTHROPIC_API_KEY` (من console.anthropic.com)، والوكيل هيستخدم Claude تلقائيًا بدل Gemini.
- **ردود فورية بدل كل دقيقتين:**
  1. ضيف الـ Secrets دي: `IG_APP_SECRET` و `IG_VERIFY_TOKEN`.
  2. اربط الـ Webhook في تطبيق Meta على الرابط:
     `https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/instagram-agent`
  3. اشترك في الحقل **comments**، وحوّل التطبيق لـ Live.
- **التوكن** بيتجدد تلقائيًا كل أسبوع. لو وقف، الصق توكن جديد من الإعدادات.
