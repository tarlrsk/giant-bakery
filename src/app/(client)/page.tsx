import Wave from "@/components/Wave";
import BakeryItems from "@/components/BakeryItems";
import FeatureSection from "@/components/FeatureSection";
import FeatureImageContainer from "@/components/FeatureImageContainer";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section>
      <Wave />
      <div className="relative h-auto pl-36 py-28">
        <FeatureSection
          hasTag={false}
          title="ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทค"
          desc="ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทควันโดมะกัน"
          btnLabel="สั่งเลย"
        />
      </div>
      <div className="relative flex flex-col py-28 h-auto items-center justify-center gap-16">
        <div className="relative flex flex-col gap-10 items-center justify-center ">
          <h1 className="font-semibold text-5xl">สินค้าขายดี</h1>
          <p className="font-normal text-2xl">
            ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทควันโดมะกัน
          </p>
        </div>
        <div className="container flex flex-wrap-custom gap-20">
          <BakeryItems cols={4} category="" amount="4" />
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
