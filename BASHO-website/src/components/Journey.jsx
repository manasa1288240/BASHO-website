import creatorImg from "../assets/founder.jpeg";

export default function Journey() {
  return (
    <section id="journey" className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <img
          src={creatorImg}
          alt="Founder Yuki Tanaka"
          className="w-full h-auto rounded-lg shadow-lg object-cover"
        />
        <div>
          <h2 className="text-1xl font-serif text-primary mb-4">A Journey in Clay</h2>
          <p className="text-muted-foreground leading-relaxed">
            <b>Hi, I'm Shivangi - the hands and heart behind Basho.</b><br/>
            Basho, a Japanese word that means <b>A Place</b>. But for me, it's my happy place, where every moment with place is cherished. Each piece at Basho is crafted with love and individuality, making it truly one of a kind. Basho was also the name of a legendary Japanese poet known for haiku. Haiku is short, flowing verses that captures life Like poetry, pottery at Basho flows with rhythm and soul. So come, discover Basho and create your own poetry.
          </p>
        </div>
      </div>
    </section>
  );
}
