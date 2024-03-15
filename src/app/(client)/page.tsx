import Image from "next/image";
import Wave from "@/components/Wave";
import FeatureSection from "@/components/FeatureSection";
import BestSellerItems from "@/components/BestSellerItems";
import FeatureImageContainer from "@/components/FeatureImageContainer";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section>
      <Wave />
      <div className="relative flex items-center px-36 py-28">
        <FeatureSection
          hasTag={false}
          title="คุเกะโดเบเกอรี่ หลากหลายและอบใหม่ทุกวัน"
          desc="ใส่ใจทุกรายละเอียด เพื่อให้คุณได้รับขนมที่มีคุณภาพและรสชาติที่ดีที่สุด"
          btnLabel="สั่งเลย"
        />
        <Image
          className=" invisible md:visible  absolute right-40 h-full"
          src="/home-page-snack.png"
          width={100}
          height={100}
          alt="cake"
          style={{
            width: "auto",
            height: "120%",
          }}
        />
      </div>

      <div className="relative flex flex-col py-28 h-auto items-center justify-center gap-8 md:gap-16">
        <div className="relative flex flex-col gap-4 md:gap-10 items-center justify-center ">
          <h1 className="font-semibold text-5xl">สินค้าขายดี</h1>
          <p className="font-normal text-2xl">
            สินค้าที่ขายดีที่สุดตลอดปี 2023
          </p>
        </div>
        <div className="container flex flex-wrap-custom gap-20 justify-center">
          <BestSellerItems />
        </div>
      </div>
      <div className="relative flex flex-col gap-2 mb-2">
        <div className="relative flex py-28 items-start justify-start pl-40">
          <FeatureImageContainer img={"/feature-image-1.png"} />
          <FeatureSection
            title="เบเกอรี่อบใหม่ทุกวัน "
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
        </div>
        <div className="relative flex py-28 items-end justify-end pr-40">
          <FeatureImageContainer img={"/feature-image-2.png"} />
          <FeatureSection
            title="ชุดเบรกจัดได้"
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
        </div>
        <div className="relative flex py-28 items-start justify-start pl-40">
          <FeatureImageContainer img={"/feature-image-1.png"} />
          <FeatureSection
            title="เค้กแต่งตามใจฉัน"
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
        </div>
      </div>
    </section>
  );
}
