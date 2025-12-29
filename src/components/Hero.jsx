import heroImg from "../assets/hero1.jpg";

export default function Hero() {
  return (
    <section
      id="home"
      className="hero w-full h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex items-center justify-center h-full flex-col px-6">
        <h1 className="text-white text-5xl md:text-7xl font-serif font-bold">
          場所
        </h1>
        <p className="text-white text-xl md:text-2xl mt-4 max-w-2xl">
          ---BASHO---<br/>
          (noun)<br/>
          baa-sho /<br/>
          origin:Japanese<br/>
          <b>A place - A space that sparks joy, creativity, or comfort</b>
        </p>
      </div>
    </section>
  );
}