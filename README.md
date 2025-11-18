# MedSync AI – Medical SaaS Demo

منصّة ويب طبية احترافية مبنية بـ **React + TypeScript + Vite + Tailwind CSS** مع نظام أدوار كامل:

- Admin
- Doctor
- Organization (Clinics / Hospitals)

> كل البيانات في هذا المشروع Mock لأغراض العرض فقط، ولا يتم استخدام أي بيانات حقيقية.

---

## 1) المتطلبات (Requirements)

- Node.js 18 أو أحدث
- npm (يأتي عادة مع Node)

تحقق من الإصدارات:

```bash
node -v
npm -v
```

---

## 2) تثبيت الاعتمادات (Install dependencies)

داخل مجلد المشروع `MedSync AI`:

```bash
npm install
```

هذا الأمر يقوم بتحميل كل الحزم المطلوبة:

- React / React DOM
- React Router DOM
- TypeScript
- Vite
- Tailwind CSS + PostCSS + Autoprefixer

---

## 3) تشغيل نسخة التطوير (Run dev server)

بعد انتهاء التثبيت، شغّل خادم التطوير:

```bash
npm run dev
```

سيظهر لك عنوان مثل:

```text
http://localhost:5173
```

افتح العنوان في المتصفح لمعاينة المنصّة.

---

## 4) سكربتات npm المتوفرة

في ملف `package.json` توجد السكربتات التالية:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- `npm run dev` → تشغيل بيئة التطوير مع HMR
- `npm run build` → بناء نسخة Production في مجلد `dist`
- `npm run preview` → تشغيل سيرفر بسيط لمعاينة نسخة الإنتاج بعد البناء

---

## 5) طريقة الدخول (Authentication demo)

1. افتح الصفحة الرئيسية: `http://localhost:5173`
2. اضغط **Log in** أو **Launch demo**
3. اختر حساب Demo من القائمة (Admin / Organization / Doctor)
4. سيتم تحويلك تلقائياً إلى الـ Dashboard المناسب حسب الدور.

---

## 6) رفع المشروع على Git (Git / GitHub)

> نفّذ الأوامر التالية من داخل مجلد `MedSync AI` بعد إنشاء مستودع (Repo) على GitHub والحصول على رابط `origin`.

### 6.1 تهيئة git لأول مرة

```bash
git init
git add .
git commit -m "Initial MedSync AI demo"
```

### 6.2 ربط المشروع بمستودع GitHub

استبدل `YOUR_USERNAME` و `YOUR_REPO` بالقيم المناسبة:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

بعد ذلك، كلما أجريت تعديلات:

```bash
git add .
git commit -m "Update"
git push
```

---

## 7) ملاحظات

- المشروع Demo فقط، بدون Backend حقيقي.
- إدارة مفاتيح الـ API وكل الـ Analytics تعمل على بيانات Mock داخل الواجهة الأمامية.
- يمكنك تعديل الألوان والهوية البصرية من:
  - `tailwind.config.cjs`
  - `src/styles/index.css`
