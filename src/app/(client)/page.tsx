import Image from "next/image";
import Wave from "@/components/Wave";
import BakeryItems from "@/components/BakeryItems";
import FeatureSection from "@/components/FeatureSection";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section>
      <Wave />
      <div className="relative flex flex-col items-center px-11 py-2 text-center md:flex-row md:px-36 md:py-28 md:text-left">
        <Image
          className=" h-full md:absolute md:right-40"
          src="/home-page-snack.png"
          width={100}
          height={100}
          alt="cake"
          style={{
            width: "auto",
            height: "120%",
          }}
        />
        <FeatureSection
          hasTag={false}
          title="คุเกะโดเบเกอรี่ หลากหลายและอบใหม่ทุกวัน"
          desc="ใส่ใจทุกรายละเอียด เพื่อให้คุณได้รับขนมที่มีคุณภาพและรสชาติที่ดีที่สุด"
          btnLabel="สั่งเลย"
        />
      </div>

      <div className="relative flex h-auto flex-col items-center justify-center gap-16 py-28">
        <div className="relative flex flex-col items-center justify-center gap-10 ">
          <h1 className="text-4xl font-semibold md:text-5xl">สินค้าขายดี</h1>
        </div>
        <div className="flex-wrap-custom container flex gap-20">
          <BakeryItems cols={4} category="" amount="4" />
        </div>
      </div>
      <div className="relative mb-2 flex flex-col gap-20 md:gap-10">
        <div className="relative flex items-center justify-center px-10 md:items-start  md:justify-start md:pl-40 md:pr-0">
          {/* <FeatureImageContainer img={"/feature-image-1.png"} /> */}
          <FeatureSection
            title="เบเกอรี่อบใหม่ทุกวัน "
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
        </div>
        <div className="relative flex items-end justify-end px-10 md:pl-0 md:pr-40">
          {/* <FeatureImageContainer img={"/feature-image-2.png"} /> */}
          <FeatureSection
            title="ชุดเบรกจัดได้"
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="จัดชุดเบรก"
          />
        </div>
        <div className="relative mb-16 flex items-start justify-start px-10 md:pl-40 md:pr-0">
          {/* <FeatureImageContainer img={"/feature-image-1.png"} /> */}
          <FeatureSection
            title="เค้กแต่งตามใจฉัน"
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="แต่งเค้ก"
          />
        </div>
      </div>
    </section>
  );
}
