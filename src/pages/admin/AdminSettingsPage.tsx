import { Card } from '../../components/ui/Card'
import { useLanguage } from '../../context/LanguageContext'

function AdminSettingsPage() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {language === 'ar' ? 'إعدادات المنصّة' : 'Platform settings'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {language === 'ar'
            ? 'مفاتيح تحكم عالية المستوى لتهيئة بيئة العرض التجريبية لمنصّة MedSync AI.'
            : 'High-level configuration toggles for the MedSync AI demo environment.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {language === 'ar' ? 'التنبيهات' : 'Alerting'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'تهيئة الطريقة التي ستنبه بها المنصّة المسؤولين عندما تصبح جميع مفاتيح الذكاء الاصطناعي في حالة تدهور أو تعطّل.'
              : 'Configure how the platform would notify admins when all AI keys are degraded or down.'}
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>
                {language === 'ar'
                  ? 'إرسال بريد إلكتروني للمسؤولين عندما تتعطل جميع المفاتيح'
                  : 'Email platform admins when all keys are down'}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" />
              <span>
                {language === 'ar'
                  ? 'إرسال ملخص أسبوعي لجودة الوصفات'
                  : 'Send weekly prescribing quality summary'}
              </span>
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {language === 'ar' ? 'التدقيق والتسجيل' : 'Audit and logging'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'مفاتيح تجريبية توضح كيف يمكن للنشر الفعلي تتبّع أحداث الوصفات الطبية.'
              : 'Demo-only toggles showing how a real deployment could capture prescribing events.'}
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>
                {language === 'ar'
                  ? 'تتبع قرارات مراجعة الذكاء الاصطناعي (معتمدة، مرفوضة، معلمة)'
                  : 'Track AI review decisions (approved, rejected, flagged)'}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>
                {language === 'ar'
                  ? 'تفعيل تحليلات الوصفات على مستوى كل منشأة'
                  : 'Enable per-organization prescribing analytics'}
              </span>
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {language === 'ar' ? 'اللغة وسلوك المنصّة' : 'Language & behavior'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'تحكّم في لغة الواجهة واتجاه العرض لمواءمة المنصّة مع بيئة المستخدم.'
              : 'Control interface language and display direction to match your environment.'}
          </p>
          <div className="mt-3 space-y-3 text-xs">
            <label className="space-y-1 block">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'لغة الواجهة الافتراضية' : 'Default interface language'}
              </span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value === 'ar' ? 'ar' : 'en')}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
                <span>
                  {language === 'ar'
                    ? 'عرض تعليمات المريض باللغتين (العربية والإنجليزية) في صفحة الوصفة النهائية'
                    : 'Show patient instructions in both English and Arabic on the final prescription view'}
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
                <span>
                  {language === 'ar'
                    ? 'فرض استخدام نمط الكتابة من اليمين لليسار عند اختيار اللغة العربية'
                    : 'Force right-to-left layout when Arabic is selected'}
                </span>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminSettingsPage
