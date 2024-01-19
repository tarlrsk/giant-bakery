import Wave from "@/components/Wave";
import ProductCard from "@/components/ProductCard";
import FeatureSection from "@/components/FeatureSection";
import FeatureImageContainer from "@/components/FeatureImageContainer";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section className="m-2">
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
        <div className="relative flex gap-28">
          <ProductCard name="temp 1" price={8.0} img="logo.png" />
          <ProductCard name="temp 2" price={8.0} img="logo.png" />
          <ProductCard name="temp 3" price={8.0} img="logo.png" />
          <ProductCard name="temp 4" price={8.0} img="logo.png" />
          <ProductCard name="temp 5" price={8.0} img="logo.png" />
        </div>
        <div className="relative flex items-center justify-center gap-80">
          <FeatureImageContainer
            img1="/logo-white.png"
            img2="/logo-white.png"
          />
          <FeatureSection
            title="เบเกอรี่อบใหม่ทุกวัน "
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
        </div>
        <div className="relative flex items-center justify-center gap-80">
          <FeatureSection
            title="ชุดเบรกจัดได้"
            desc="เบเกอรี่แสนอร่อยคุณภาพสูงไร้ไขมันทรานส์ ไม่มีวัตถุกันเสียทำสดใหม่ทุกวัน การันตรีด้วยคุณภาพมากกว่า 35 ปีสั่งได้ 24 ชั่วโมงสำหรับจัด Break งานประชุม"
            btnLabel="สั่งเลย"
          />
          <FeatureImageContainer
            img1="/logo-white.png"
            img2="/logo-white.png"
          />
        </div>
        <div className="relative flex items-center justify-center gap-80">
          <FeatureImageContainer
            img1="/logo-white.png"
            img2="/logo-white.png"
          />
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
