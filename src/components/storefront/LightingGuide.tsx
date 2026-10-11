import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lightbulb, Info, Eye, Sun, Sparkles } from 'lucide-react';

const LightingGuide = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Interactive CCT Slider state (Kelvin)
  const [kelvin, setKelvin] = useState(3000);
  
  // Interactive Beam Angle state (Spot vs. Downlight)
  const [beamType, setBeamType] = useState<'spot' | 'down'>('spot');

  // Convert Kelvin temperature to a CSS color representation
  const getCctColor = (k: number) => {
    if (k < 3200) return 'rgba(251, 146, 60, 0.25)'; // Amber/Warm Orange
    if (k < 4500) return 'rgba(253, 224, 71, 0.15)';  // Natural Soft Yellowish
    if (k < 5500) return 'rgba(248, 250, 252, 0.1)';  // Neutral White
    return 'rgba(56, 189, 248, 0.18)';                 // Cool Daylight Blueish
  };

  const getCctLabel = (k: number) => {
    if (k < 3200) return isRTL ? 'إضاءة دافئة (2700K - 3000K)' : 'Warm White (2700K - 3000K)';
    if (k < 4500) return isRTL ? 'إضاءة طبيعية (4000K)' : 'Natural White (4000K)';
    return isRTL ? 'إضاءة باردة / نهاري (6000K - 6500K)' : 'Cool White / Daylight (6000K - 6500K)';
  };

  const getCctUse = (k: number) => {
    if (k < 3200) {
      return isRTL 
        ? 'مثالية لغرف النوم والمجالس والمطاعم الفاخرة لخلق أجواء دافئة ومريحة للاسترخاء.' 
        : 'Best for living rooms, bedrooms, and dining areas to create a cozy, relaxing ambiance.';
    }
    if (k < 4500) {
      return isRTL 
        ? 'مثالية للمطابخ والمكاتب والمعارض والممرات حيث تحتاج إلى رؤية واضحة وألوان طبيعية.' 
        : 'Best for kitchens, offices, hallways, and shops where clarity and natural color accuracy are key.';
    }
    return isRTL 
      ? 'مثالية للمكاتب الهندسية، المختبرات، كشافات الملاعب، والحدائق الخارجية لزيادة التركيز والوضوح.' 
      : 'Best for task lighting, offices, outdoor gardens, and storage rooms requiring high focus and visibility.';
  };

  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] dark:bg-slate-900/10 relative overflow-hidden">
      <div className="container relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="eyebrow-light mb-3">
            {isRTL ? "دليل كواليتي لايت التعليمي" : "Educational Lighting Guide"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isRTL ? "كيف تختار إضاءة منزلك؟" : "How to Choose the Right Lighting"}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isRTL 
              ? "تفاصيل فنية بسيطة وتفاعلية لتساعدك في اختيار درجة حرارة اللون المناسبة وزاوية انتشار الضوء المناسبة لمشروعك."
              : "Simple, interactive resources to help you choose the right color temperature and beam angles for your space."}
          </p>
        </div>

        {/* Interactive Tabs */}
        <Tabs defaultValue="cct" className="w-full max-w-5xl mx-auto bg-card rounded-3xl p-6 md:p-10 border border-border/80 shadow-lg">
          <TabsList className="grid grid-cols-3 mb-10 max-w-md mx-auto rounded-full bg-slate-100 dark:bg-slate-900 p-1">
            <TabsTrigger value="cct" className="rounded-full py-2.5 text-xs md:text-sm font-bold">
              {isRTL ? "حرارة اللون CCT" : "Color Temp CCT"}
            </TabsTrigger>
            <TabsTrigger value="beam" className="rounded-full py-2.5 text-xs md:text-sm font-bold">
              {isRTL ? "زوايا الضوء" : "Beam Angles"}
            </TabsTrigger>
            <TabsTrigger value="calculations" className="rounded-full py-2.5 text-xs md:text-sm font-bold">
              {isRTL ? "نصائح الحساب" : "Lighting Tips"}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CCT Color Temperature Simulator */}
          <TabsContent value="cct" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              
              {/* Room simulator preview card */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 shadow-inner flex flex-col justify-end">
                {/* Simulated Room Background Mockup */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                    alt="Mock room"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Dynamic Color filter overlay representing light temperature */}
                  <div 
                    className="absolute inset-0 transition-colors duration-300 pointer-events-none mix-blend-color" 
                    style={{ backgroundColor: getCctColor(kelvin) }} 
                  />
                  <div 
                    className="absolute inset-0 transition-colors duration-500 pointer-events-none mix-blend-multiply opacity-70" 
                    style={{ backgroundColor: getCctColor(kelvin) }} 
                  />
                </div>

                {/* Info Overlay inside room */}
                <div className="relative z-10 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                        {isRTL ? "المحاكاة التفاعلية" : "Interactive Room Preview"}
                      </p>
                      <h4 className="font-bold text-lg text-amber-400 mt-0.5">
                        {kelvin}K
                      </h4>
                    </div>
                    <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                      {getCctLabel(kelvin)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider and description controls */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" />
                    <span>{isRTL ? "جهاز محاكاة لون الإضاءة" : "Color Temperature Simulator"}</span>
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm mt-2 leading-relaxed">
                    {isRTL 
                      ? "قم بتحريك المؤشر لتغيير درجة حرارة اللون وملاحظة تأثيرها على الأثاث والمساحة المحيطة بك." 
                      : "Drag the slider to adjust the color temperature and witness how different kelvin settings transform the ambiance of this interior."}
                  </p>
                </div>

                {/* Slider */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mb-4">
                    <span>2700K ({isRTL ? "أصفر دافئ جداً" : "Warm Cozy"})</span>
                    <span>4000K ({isRTL ? "أبيض طبيعي" : "Natural White"})</span>
                    <span>6500K ({isRTL ? "نهاري بارد" : "Cool Daylight"})</span>
                  </div>
                  <Slider
                    min={2700}
                    max={6500}
                    step={100}
                    value={[kelvin]}
                    onValueChange={(val) => setKelvin(val[0])}
                    className="cursor-pointer"
                  />
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <span className="text-sm font-bold text-primary">{kelvin} Kelvin</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">
                        {isRTL ? "أين يُستخدم هذا اللون؟" : "Recommended Use Case"}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {getCctUse(kelvin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* TAB 2: Spotlights vs. Downlights Beam Angles */}
          <TabsContent value="beam" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              
              {/* Beam angle diagram card */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 flex items-center justify-center p-6 border border-border/10 shadow-inner">
                {/* Grid guidelines */}
                <div className="absolute inset-0 grid grid-cols-12 gap-0 pointer-events-none opacity-5">
                  {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white h-full" />)}
                </div>

                {/* Ceiling fixture */}
                <div className="absolute top-8 w-12 h-6 bg-slate-800 rounded-t-lg border-b-2 border-primary z-20 flex items-center justify-center">
                  <div className="w-6 h-3 bg-amber-400 rounded-full blur-[2px] animate-pulse" />
                </div>

                {/* Visual Conic gradient light beam */}
                <div 
                  className="absolute top-14 w-full h-[70%] origin-top transition-all duration-500 ease-out z-10"
                  style={{
                    background: beamType === 'spot'
                      ? 'conic-gradient(from 168deg at 50% 0%, transparent, rgba(251, 191, 36, 0.4) 6deg, rgba(251, 191, 36, 0.4) 18deg, transparent 24deg)'
                      : 'conic-gradient(from 125deg at 50% 0%, transparent, rgba(251, 191, 36, 0.3) 45deg, rgba(251, 191, 36, 0.3) 65deg, transparent 110deg)',
                    filter: 'blur(3px)'
                  }}
                />

                {/* Floor target */}
                <div className="absolute bottom-6 flex flex-col items-center">
                  {beamType === 'spot' ? (
                    <motion.div 
                      layoutId="beamFloor"
                      className="w-16 h-4 bg-amber-400/50 rounded-full blur-sm"
                    />
                  ) : (
                    <motion.div 
                      layoutId="beamFloor"
                      className="w-64 h-8 bg-amber-400/30 rounded-full blur-md"
                    />
                  )}
                  <span className="text-[10px] text-slate-500 font-mono mt-3">
                    {beamType === 'spot' ? 'Focused Area (15° - 36°)' : 'Distributed Light (60° - 120°)'}
                  </span>
                </div>

                {/* Floating label */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                  {beamType === 'spot' ? 'Beam angle: 24°' : 'Beam angle: 90°'}
                </div>
              </div>

              {/* Explanatory controls */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-amber-500" />
                    <span>{isRTL ? "مقارنة زاوية انتشار الضوء" : "Spotlights vs. Downlights"}</span>
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm mt-2 leading-relaxed">
                    {isRTL
                      ? "اضغط لتحديد النوع ومعرفة الفارق البصري والعملي بين الإضاءة المركزة والمشتتة."
                      : "Click to toggle between Spotlight and Downlight to see the structural difference in beam cones and coverage."}
                  </p>
                </div>

                {/* Toggle controls */}
                <div className="flex gap-4">
                  <Button 
                    variant={beamType === 'spot' ? 'default' : 'outline'}
                    onClick={() => setBeamType('spot')}
                    className="flex-1 rounded-2xl h-12 font-bold text-xs sm:text-sm gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>{isRTL ? "سبوت لايت (إضاءة مركزة)" : "Spotlight (Focused)"}</span>
                  </Button>
                  <Button 
                    variant={beamType === 'down' ? 'default' : 'outline'}
                    onClick={() => setBeamType('down')}
                    className="flex-1 rounded-2xl h-12 font-bold text-xs sm:text-sm gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    <span>{isRTL ? "داون لايت (إضاءة عامة)" : "Downlight (Wide)"}</span>
                  </Button>
                </div>

                {/* Description list */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-border space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-1">
                      {beamType === 'spot' 
                        ? (isRTL ? "السبوت لايت (إضاءة المهام والديكور)" : "Spotlights (Accent & Task)")
                        : (isRTL ? "الداون لايت (الإضاءة العامة للمحيط)" : "Downlights (Ambient & General)")}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {beamType === 'spot'
                        ? (isRTL 
                            ? "زاوية ضيقة تركز الضوء على لوحات الجدار، الأثاث، أو التحف لإبراز التفاصيل الفنية وخلق ظلال جمالية متباينة."
                            : "A narrow beam designed to highlight objects like paintings, artwork, tables, or textured walls, adding dramatic contrast.")
                        : (isRTL 
                            ? "زاوية عريضة توزع الضوء بشكل متساوٍ ومريح في الغرفة، مما يقلل الظلال ويغمر المساحة بإضاءة ناعمة وشاملة."
                            : "A wide beam designed to flood a room with soft, general lighting, minimizing harsh shadows and maximizing overall visibility.")}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* TAB 3: How to calculate & CRI guidelines */}
          <TabsContent value="calculations" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: How many fixtures */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-border p-6 rounded-2xl flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-primary flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {isRTL ? "حساب عدد الكشافات المطلوبة" : "Calculate Fixture Count"}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                    {isRTL
                      ? "كقاعدة عامة للأسقف ذات الارتفاع العادي (3 أمتار): ضع مسافة بين الكشافات من 1 إلى 1.2 متر. اترك مسافة 60 سم تقريباً من الجدران لتجنب الانعكاسات الحادة."
                      : "For standard ceilings (3 meters): space recessed downlights 1.0 to 1.2 meters apart. Keep fixtures roughly 60cm away from walls to prevent harsh halos."}
                  </p>
                </div>
              </div>

              {/* Card 2: CRI value */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-border p-6 rounded-2xl flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-primary flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-foreground flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-amber-500" />
                    {isRTL ? "مؤشر تجسيد اللون (CRI)" : "Understanding CRI"}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                    {isRTL
                      ? "اختر دائماً منتجات ذات مؤشر CRI > 90. هذا المؤشر يضمن بقاء ألوان الأثاث والملابس والأطعمة واقعية وحيوية كما لو كانت تحت ضوء الشمس."
                      : "Always opt for lighting fixtures with CRI > 90. This rating ensures the colors of your furniture, fabrics, and spaces remain vivid, natural, and true."}
                  </p>
                </div>
              </div>

              {/* Card 3: Cutouts planning */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-border p-6 rounded-2xl flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-primary flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-foreground flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-amber-500" />
                    {isRTL ? "قياس فتحة السقف Cutout" : "Cutout Planning"}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                    {isRTL
                      ? "تأكد من إبلاغ فني الجبس بمقاس فتحة الكشاف (مثلاً: 75 مم أو 95 مم) قبل عمل التخريم لتجنب اتساع الفتحات وصعوبة التعديل لاحقاً."
                      : "Verify exact cutout dimensions (e.g. 75mm, 95mm) and hand them to your gypsum team BEFORE they drill holes. Fixing mismatched cutouts is highly costly."}
                  </p>
                </div>
              </div>

            </div>
          </TabsContent>
        </Tabs>

      </div>
    </section>
  );
};

export default LightingGuide;
