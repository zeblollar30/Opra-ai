import React, { useState, useEffect, useRef } from 'react'

const SLIDE_DURATION = 4000 // 4 seconds

const DemoVideo = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [featureIndex, setFeatureIndex] = useState(-1)
  const sectionRef = useRef(null)
  const timerRef = useRef(null)

  const slides = [
    { id: 'meet', title: 'Meet Opra' },
    { id: 'features', title: 'What Opra Can Do' },
    { id: 'works', title: 'How It Works' },
    { id: 'pricing', title: 'Simple Pricing' },
    { id: 'cta', title: 'Ready?' }
  ]

  const features = [
    { icon: '📞', label: 'Make Phone Calls' },
    { icon: '💰', label: 'Lower Your Bills' },
    { icon: '📄', label: 'Fill Complex Forms' },
    { icon: '📅', label: 'Book Appointments' },
    { icon: '🔄', label: 'Chase Refunds' },
    { icon: '📊', label: 'Executive Oversight' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true)
        } else {
          setIsPlaying(false)
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, SLIDE_DURATION)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, slides.length])

  // Handle nested feature animation for Slide 1 (index 1)
  useEffect(() => {
    if (currentSlide === 1 && isPlaying) {
      setFeatureIndex(-1)
      const interval = SLIDE_DURATION / (features.length + 1)
      const fTimer = setInterval(() => {
        setFeatureIndex((prev) => {
          if (prev < features.length - 1) return prev + 1
          return prev
        })
      }, interval)
      return () => clearInterval(fTimer)
    }
  }, [currentSlide, isPlaying, features.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section ref={sectionRef} id="demo" className="py-24 bg-[#050505] text-white overflow-hidden relative min-h-[600px] flex items-center justify-center">
      {/* Theater Lighting Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
        {/* Top Controls */}
        <div className="absolute top-[-4rem] right-4 flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg className="w-5 h-5 fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>

        {/* Stage / Screen */}
        <div className="bg-[#111] rounded-[2rem] border border-white/5 shadow-[0_0_100px_rgba(10,110,110,0.15)] aspect-video flex items-center justify-center overflow-hidden relative">
          
          {/* Slide 1: Meet Opra */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-12 transition-all duration-1000 transform ${currentSlide === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
             <img src="/brand/opra-logo-inverse.svg" alt="Opra Logo" className="h-20 mb-8" />
             <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">The AI operator for everyone</h2>
             <p className="text-xl text-text-light max-w-xl">Your executive assistant that actually does things.</p>
          </div>

          {/* Slide 2: What Opra Can Do */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-1000 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <h3 className="text-2xl font-bold mb-10 text-primary uppercase tracking-[0.2em]">What Opra Can Do</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full max-w-2xl">
                {features.map((f, i) => (
                  <div key={i} className={`flex items-center gap-4 transition-all duration-500 transform ${featureIndex >= i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-xl font-medium text-gray-200">{f.label}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Slide 3: How It Works */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-1000 ${currentSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
             <h3 className="text-2xl font-bold mb-16 text-primary uppercase tracking-[0.2em]">How It Works</h3>
             <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4 w-full">
                {[
                  { step: '01', text: 'Describe what you need' },
                  { step: '02', text: 'Opra acts' },
                  { step: '03', text: 'Done.' }
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 flex flex-col items-center text-center">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black text-2xl mb-4 shadow-xl">
                          {s.step}
                       </div>
                       <p className="font-bold text-xl">{s.text}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block w-12 h-[2px] bg-gradient-to-r from-primary/50 to-transparent mb-8"></div>
                    )}
                  </React.Fragment>
                ))}
             </div>
          </div>

          {/* Slide 4: Simple Pricing */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-1000 ${currentSlide === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
             <h3 className="text-2xl font-bold mb-12 text-primary uppercase tracking-[0.2em]">Simple Pricing</h3>
             <div className="flex gap-4 w-full max-w-3xl">
                {[
                  { name: 'Starter', price: '$9' },
                  { name: 'Pro', price: '$24' },
                  { name: 'Unlimited', price: '$49' }
                ].map((p, i) => (
                  <div key={i} className={`flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-700 transform delay-${i * 100} ${currentSlide === 3 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                    <p className="text-sm font-bold text-text-light mb-2">{p.name}</p>
                    <p className="text-3xl font-black">{p.price}<span className="text-sm font-normal text-text-light">/mo</span></p>
                  </div>
                ))}
             </div>
             <p className="mt-12 text-xl italic text-primary animate-bounce">No subscription? $1 per task</p>
          </div>

          {/* Slide 5: CTA */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-12 transition-all duration-1000 ${currentSlide === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
             <h2 className="text-5xl md:text-6xl font-black mb-8">Ready to take back your time?</h2>
             <button className="brand-gradient text-white text-2xl px-12 py-6 rounded-full font-bold hover:shadow-[0_0_40px_rgba(10,110,110,0.5)] transition-all transform hover:-translate-y-1 mb-8">
               Start for Free
             </button>
             <p className="text-xl text-text-light">Join thousands saving hours every week</p>
          </div>

        </div>

        {/* Progress Bar / Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-surface text-text-dark font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed w-full bg-surface/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <img src="/brand/opra-logo.svg" alt="Opra Logo" className="h-14 w-auto" />
            </div>
            <div className="hidden md:flex space-x-10 items-center text-sm font-medium">
              <a href="#features" className="text-text-medium hover:text-primary transition-colors font-semibold">Features</a>
              <a href="#how-it-works" className="text-text-medium hover:text-primary transition-colors font-semibold">How It Works</a>
              <a href="#pricing" className="text-text-medium hover:text-primary transition-colors font-semibold">Pricing</a>
              <button className="brand-gradient text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:opacity-90 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-widest mb-6 border border-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              The AI Operator is Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-text-dark">
              An AI that <span className="text-primary italic">actually</span> does things.
            </h1>
            <p className="text-xl text-text-medium mb-10 max-w-2xl leading-relaxed">
              Opra is your executive assistant. It makes phone calls, books appointments, negotiates bills, and fills forms end-to-end. <span className="font-bold text-text-dark underline decoration-accent decoration-2 underline-offset-4">YOU TALK. WE ACT.</span>
            </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
                  <button className="brand-gradient text-white text-lg px-10 py-5 rounded-full font-bold hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5">
                    Start for Free
                  </button>
                  <a href="#demo" className="bg-white border border-border text-text-dark text-lg px-10 py-5 rounded-full font-bold hover:bg-surface transition-all flex items-center justify-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-4 h-4 text-primary ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .8.4l11-6.5a.5.5 0 0 0 0-.8l-11-6.5a.5.5 0 0 0-.3-.1z"></path></svg>
                    </div>
                    Watch Demo
                  </a>
                </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px]"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-white">
              <img src="/brand/opra-brand-hero.png" alt="Opra AI Interface" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-primary">Administrative busywork, handled.</h2>
            <p className="text-text-medium max-w-xl mx-auto text-lg">Opra goes beyond chatting — it interacts with the real world to save you hours every week.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Make Phone Calls', desc: 'Opra calls businesses to book appointments, check availability, or resolve complex issues.' },
              { title: 'Lower Your Bills', desc: 'Our AI negotiates with providers to get you better rates on internet, mobile, and more.' },
              { title: 'Fill Complex Forms', desc: 'From insurance claims to event registrations, Opra handles the tedious data entry.' },
              { title: 'Book Appointments', desc: 'Dentists, hair salons, or restaurants — Opra finds the time and secures your spot.' },
              { title: 'Chase Refunds', desc: 'Got a flight delay or a faulty product? Opra handles the back-and-forth for your refund.' },
              { title: 'Executive Oversight', desc: 'Get a full report of every task completed, every dollar saved, and every minute reclaimed.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] border border-border/40 hover:shadow-2xl hover:shadow-primary/5 transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:brand-gradient group-hover:text-white transition-all shadow-sm">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-text-medium leading-relaxed text-lg">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DemoVideo />

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-6 text-primary">Three steps to a clearer schedule.</h2>
            <p className="text-text-medium text-lg">The operator experience is built for simplicity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
             {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-border -z-10"></div>
            
            {[
              { step: '01', title: 'Assign a Task', desc: 'Just tell Opra what you need done. "Book a dentist" or "Lower my bill".' },
              { step: '02', title: 'Opra Acts', desc: 'The AI uses phone, email, and web interfaces to execute the task securely.' },
              { step: '03', title: 'Task Done', desc: 'Receive a notification and a detailed summary. Reclaim your time.' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-primary flex items-center justify-center text-3xl font-black text-primary mb-8 shadow-xl shadow-primary/10 transition-transform hover:scale-110">
                  {s.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-text-medium text-lg max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-text-dark text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] brand-gradient rounded-full blur-[180px] opacity-20 -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-text-light text-xl">Choose the plan that fits your life. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Starter', price: '9', tasks: '10' },
              { name: 'Pro', price: '24', tasks: '50', popular: true },
              { name: 'Unlimited', price: '49', tasks: 'Unlimited' }
            ].map((p, i) => (
              <div key={i} className={`p-12 rounded-[2.5rem] border ${p.popular ? 'border-primary bg-white/[0.07] backdrop-blur-md shadow-2xl shadow-primary/10' : 'border-white/10 bg-white/[0.03]'} relative flex flex-col transition-all hover:border-primary/50 group`}>
                {p.popular && <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">Most Popular</span>}
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors">{p.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold">${p.price}</span>
                    <span className="text-text-light text-xl">/mo</span>
                  </div>
                </div>
                <ul className="space-y-6 mb-12 text-gray-300 flex-grow text-lg">
                  <li className="flex items-center gap-4">
                    <div className="bg-primary/30 p-1.5 rounded-full"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>
                    <span className="font-medium">{p.tasks} tasks</span> included
                  </li>
                  <li className="flex items-center gap-4">
                     <div className="bg-primary/30 p-1.5 rounded-full"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>
                    Pay-per-task: <span className="text-accent font-bold">$1/task</span>
                  </li>
                  <li className="flex items-center gap-4">
                     <div className="bg-primary/30 p-1.5 rounded-full"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>
                    Priority execution
                  </li>
                </ul>
                <button className={`w-full py-5 rounded-full font-bold text-xl transition-all ${p.popular ? 'brand-gradient text-white hover:shadow-xl hover:shadow-primary/40 active:scale-95' : 'bg-white text-text-dark hover:bg-gray-100 active:scale-95'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
          <p className="text-center mt-16 text-text-light italic text-lg opacity-80">
            No subscription? Just pay $1 per task when you need us.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-5">
            <img src="/brand/opra-logo.svg" alt="Opra Logo" className="h-12 w-auto" />
            <p className="text-text-light text-lg">The AI operator for everyone.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-10 text-base font-bold text-text-medium">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-text-light text-sm tracking-widest uppercase">© 2025 Opra AI. YOU TALK. WE ACT.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
