import Wave from "@/components/Wave";
import FeatureSection from "@/components/FeatureSection";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <section>
      <Wave />
      <div className="relative w-screen h-auto pl-36 py-28">
        <FeatureSection
          hasTag={false}
          title="ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทค"
          desc="ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทควันโดมะกัน"
          btnLabel="สั่งเลย"
        />
      </div>
      <div className="relative flex flex-col py-28 w-screen h-auto items-center justify-center gap-10">
        <h1 className="font-semibold text-5xl">สินค้าขายดี</h1>
        <p className="font-normal text-2xl">
          ไดเอ็ตแคมป์ริกเตอร์ ฮอตแซ็กโซโฟนฟินิกซ์เทควันโดมะกัน
        </p>
      </div>
    </section>
  );
}
