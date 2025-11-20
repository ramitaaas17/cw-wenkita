// app/page.tsx

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <section id="inicio">
        <Hero />
      </section>

      <section id="servicios">
        <Services />
      </section>

      <section id="nosotros">
        <About />
      </section>

      <Footer />
    </main>
  );
}