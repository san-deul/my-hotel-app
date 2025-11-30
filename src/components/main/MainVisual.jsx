import Carousel from "../common/Carousel";

const MainVisual = () => {
  const images = [
    {
      id: 1,
      image_url:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000",
    },
    {
      id: 2,
      image_url:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      image_url:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section
      className="
        w-full 
        h-[80vh] 
        md:h-[90vh]     /* PC 높이 */
        relative
      "
    >
      <Carousel images={images} />
    </section>
  );
};

export default MainVisual;
