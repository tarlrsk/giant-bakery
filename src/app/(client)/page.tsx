import Wave from "@/components/Wave";
import BestSellerItems from "@/components/BestSellerItems";
import HomeFeatureHeader from "@/components/home/HomeFeatureHeader";
import HomeFeatureContent from "@/components/home/HomeFeatureContent";

// ----------------------------------------------------------------------

type IFeatureItem = {
  title: string;
  desc: string;
  image: string;
  btnLabel: string;
  align: "left" | "right";
  className?: string;
};

const FEATURE_ITEMS: IFeatureItem[] = [
  {
    title: "เบเกอรี่อบใหม่ทุกวัน",
    desc: "เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม",
    btnLabel: "สั่งเลย",
    align: "left",
    image: "/home-croissant.webp",
  },
  {
    title: "ชุดเบรกเลือกได้",
    desc: "เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม",
    btnLabel: "จัดชุดเบรก",
    align: "right",
    image: "/home-snack-box.png",
  },
  {
    title: "เค้กแต่งเอง",
    desc: "เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม",
    btnLabel: "แต่งเค้ก",
    align: "left",
    image: "/home-cake.png",
    className: " mb-32",
  },
];

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section>
      <Wave />
      <div className=" container">
        <HomeFeatureHeader
          title="อร่อยไปพร้อมกับความสนุกได้ทุกเวลาที่นี้กับเรา Cukedoh"
          desc="ใส่ใจทุกรายละเอียด เพื่อให้คุณได้รับขนมที่มีคุณภาพและรสชาติที่ดีที่สุด"
          btnLabel="สั่งเลย"
        />

        <div className="relative flex h-auto flex-col items-center justify-center gap-8 py-28 md:gap-16">
          <div className="relative flex flex-col items-center justify-center gap-4 md:gap-10 ">
            <h1 className="text-5xl font-semibold">สินค้าขายดี</h1>
            <p className="text-2xl font-normal">
              สินค้าที่ขายดีที่สุดตลอดปี 2023
            </p>
          </div>
          <div className="flex-wrap-custom flex justify-center gap-20">
            <BestSellerItems />
          </div>
        </div>

        <div className="relative mb-2 flex flex-col gap-32 md:gap-0">
          {FEATURE_ITEMS.map((item, index) => (
            <HomeFeatureContent
              key={index}
              title={item.title}
              desc={item.desc}
              btnLabel={item.btnLabel}
              align={item.align}
              image={item.image}
              className={item.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
