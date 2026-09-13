import { getProjects } from "@/lib/safeDb";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

const fallbackProjects = [
  // 2026
  { id: 1, title: "Currents 2UP", category: "Disney+ · Promo", year: 2026, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/86539a5e-01ed-43b2-8299-5b80fdbeb5a8_rwc_213x0x1381x1080x640.png?h=d9c03d342b02444e0b82a56274cfd64b", videoType: null },
  { id: 2, title: "Romance 2UP", category: "Disney+ · Promo", year: 2026, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/c716a1d5-ef52-4d01-bae4-85a0b0eed224_rwc_270x0x1381x1080x640.png?h=dff3c08f41281e58fe886180be872538", videoType: null },
  { id: 3, title: "Police & Court 2UP (draft)", category: "Disney+ · Promo", year: 2026, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/336ae34e-ee00-4dfd-8566-aa251ea816ca_rwc_0x93x933x729x640.png?h=fee91285cf240d5ed3c9e4b4b0a4fc6e", videoType: null },
  // 2025
  { id: 4, title: "Made in Korea [Ver.B, C]", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/0ba655eb-8621-4f8b-9517-94d4275547e5_rwc_0x0x1080x844x640.png?h=369867928c9dec998ec6702ae39ccac4", videoType: null },
  { id: 5, title: "TM & MIK Upcoming 2UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/79123ab1-f13c-4383-a35d-57b78f7d4489_rwc_0x117x1080x844x640.png?h=d88c26f2e87deaa57ee4d4ad6614a043", videoType: null },
  { id: 6, title: "Lilo & Stitch + Elio 2UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/1f5fbaa1-05e1-4d27-b47e-f95fceda79c5_rwc_453x146x1008x788x640.png?h=591324a06fa21293bf5eadc52e51d771", videoType: null },
  { id: 7, title: "SUM25 KR_2UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/4de0f9af-08b3-4974-88fd-c3247423a07f_rwc_388x93x1140x891x640.png?h=a85c8717193d74d7ee684fd0ed2f6268", videoType: null },
  { id: 8, title: "KR Upcoming 2UP Refresh", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/209555da-a8f4-4e96-b646-89ba2c3f2947_rwc_251x0x1381x1080x640.png?h=1c9dd24dd0e4df0acccaaf4ffdbf6dc2", videoType: null },
  { id: 9, title: "KR Upcoming 3UP (May)", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/9250cf04-9bca-45c6-b74a-033b6c5fd73c_rwc_533x0x1381x1080x640.png?h=a216265d77cdafaefd03f8c2abc19056", videoType: null },
  { id: 10, title: "25 Spring Post Promo Upcoming 3UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/ae6f5d55-d4ab-4f03-a3ff-4288c32c816c_rwc_364x0x1381x1080x640.png?h=88a795a22c49413008d868158eb80aeb", videoType: null },
  { id: 11, title: "25 Spring Promo Upcoming 3UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/ff1169f1-d36c-421c-9991-9aeaa9239f99_rwc_376x0x1381x1080x640.png?h=cc6673af7ec8959b5b9072ee8a3e5b71", videoType: null },
  { id: 12, title: "Luna New Year 3UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/e37f576c-0d5d-4344-a210-8f8fe0c0e7dc_rwc_397x0x1389x1086x640.png?h=706d99b52cdb8efe9ce5dea63a4c1aad", videoType: null },
  { id: 13, title: "Kangfull 2UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/c1800c7b-e78b-4554-9c8b-516dc4ca623c_rwc_155x0x1004x785x640.png?h=f6260e28f2a7711125bd609153255876", videoType: null },
  { id: 14, title: "Blockbuster Promo 3UP", category: "Disney+ · Promo", year: 2025, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/22732b3c-8908-49c9-bd4a-e51cdc042c44_rwc_207x0x1690x1322x640.png?h=b79f80506954722e4ea15adcbdf0367a", videoType: null },
  // 2024
  { id: 15, title: "KR Thriller Mash-up 2024", category: "Disney+ · Promo", year: 2024, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/6f9ebd68-c35a-40ef-af2c-7aca91290c79_rwc_256x142x1008x788x640.png?h=0906e15dfe1da3c646d36db23642cf1b", videoType: null },
  { id: 16, title: "The World's Armed Forces", category: "Disney+ · Promo", year: 2024, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/b60e486f-2233-437e-a6cd-0a6d6a16ad7b_rwc_31x0x1381x1080x640.png?h=1d0d018237f44e9795f7936248fe2d64", videoType: null },
  { id: 17, title: "Deadpool 1 & 2 Catch-up", category: "Disney+ · Promo", year: 2024, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/856ae5c7-00ac-4a96-9fd4-fe33f2f247a2_rwc_453x146x1008x788x640.png?h=50f55dbba467af6ef4a758ef6bb43829", videoType: null },
  { id: 18, title: "KR Local Title Mash-up 2024", category: "Disney+ · Promo", year: 2024, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/07531ea6-9851-4914-b19e-cf2eb7f96c80_rwc_270x0x1381x1080x640.png?h=65043fcd86ee5fa7d125e8f0db2fc4f6", videoType: null },
  { id: 19, title: "Genie TV OAP Compilation", category: "Republic Pictures · OAP", year: 2024, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/0547400f-32a5-4472-85fd-a3fd1461ee62_rwc_64x0x671x525x640.jpg?h=df8b13c39d1438793cbfdd8c99c5d9a6", videoType: null },
  // 2023
  { id: 20, title: "Hide (하이드)", category: "JTBC · Coupang · Promo", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/2d1f01cf-54c1-4df4-a0d5-8a46abfc38b8_rwc_0x605x1280x1000x640.jpg?h=8cc427d014f40f9d7d5d85db214763e6", videoType: null },
  { id: 21, title: "KT OAP — 슬기로운 프라임 생활", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/e949df57-0c62-4750-924f-064f75809583_rwc_45x0x767x600x640.jpg?h=9fcaf22bc3a156bf788e78a837fb046b", videoType: null },
  { id: 22, title: "KT OAP — 월소녀_영소녀", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/58741649-a947-4c6e-b67d-59f57d640cad_rwc_45x0x767x600x640.jpg?h=9cee8942d2a5796e67db66a1ed3e508c", videoType: null },
  { id: 23, title: "KT OAP — 월소녀_중소녀", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/8d0b5138-50df-4f0d-8258-50a4b495a849_rwc_45x0x767x600x640.jpg?h=b8d54a3ae19ce92f01ed73a2766dc9a6", videoType: null },
  { id: 24, title: "KT OAP — 월소녀_덕후남", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/91fccf7d-3087-4ae8-8a18-54a8e1f4b4af_rwc_45x0x767x600x640.jpg?h=99132f4db7b1b7a593a5617cc3511947", videoType: null },
  { id: 25, title: "KT OAP — 월소녀_시골남", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/6841c249-a45c-4908-a766-f5ecd95ee560_rwc_45x0x767x600x640.jpg?h=c53b8689afa1a4ad630c67feb5913203", videoType: null },
  { id: 26, title: "Genie TV OAP Complication", category: "Republic Pictures · OAP", year: 2023, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/df05a6f0-be86-4b82-b01e-39f7c3bdbe92_rwc_336x0x1371x1072x640.png?h=535422fde9a51c8577b7babbe9178c2d", videoType: null },
  // 2022 — Netflix
  { id: 27, title: "Love to Hate you (연애대전)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/d5e21cee-0e36-4155-b614-a2f349f7c02e_rwc_0x320x1500x1172x640.jpg?h=c3c6da6e115d78dc04476ad59811dfd2", videoType: null },
  { id: 28, title: "The Glory (더 글로리)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/3f962a47-6efb-4eb6-87e7-900db6537f9a_rwc_0x245x1500x1172x640.jpg?h=a7773ccdd535fd4288036d6c2dbbe19e", videoType: null },
  { id: 29, title: "Somebody (썸바디)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/3e877f3e-9486-4635-9365-4d12cf512c17_rwc_0x212x1200x938x640.jpg?h=e85cfe9ef4d4b861f3b1e2c617a97f98", videoType: null },
  { id: 30, title: "Love and Leashes (모럴센스)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/9d6475dc-fa94-4b2b-9b7e-255e6474069b_rwc_0x368x853x666x640.jpg?h=4c6e41585b605bc5e35b01e0e7f4d89c", videoType: null },
  { id: 31, title: "Chain Reaction (체인 리액션)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/13928337-e68d-4b70-b4e0-23d293d398a1_rwc_0x44x1400x1094x640.jpg?h=4b8a1577399a5d2da70acf0a56a04709", videoType: null },
  { id: 32, title: "If You Wish Upon Me (당신이 소원을 말하면)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/bb6cb94f-008b-4f53-b444-e90656761b15_rwc_0x306x950x742x640.jpg?h=819b0c1d9fa446bbf14bce2ac1d86fb9", videoType: null },
  { id: 33, title: "Bulgasal (불가살)", category: "Netflix · Trailer", year: 2022, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/485e977d-cdd0-4acc-a955-db0e6500b1cd_rwc_0x73x1476x1153x640.jpg?h=dd0a1a98ce2e6cc4f12313830da87584", videoType: null },
  // 2021 and earlier — Trailer / Film
  { id: 34, title: "Sprinter (스프린터)", category: "Netflix · Trailer", year: 2021, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/bef2b9b1-57fc-4158-8124-a32ea9693f19_rwc_0x968x1500x1172x640.jpg?h=223a2566a77cdd003c3b23dcc76cd195", videoType: null },
  { id: 35, title: "Drama World 2 (드라마 월드 2)", category: "Film · Trailer", year: 2020, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/18f1d584-5d09-4178-b09a-b30aa992f789_rwc_108x0x1831x1432x640.jpg?h=3dccd5b8f17eb4a40b8755fd2d291a0c", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=BChyEC_TwJU" },
  { id: 36, title: "SF8 — 간호중", category: "Film · Trailer", year: 2020, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/df6247d9-395a-4127-b0d4-ef00946c8c31_rwc_0x446x953x745x640.jpg?h=d1ac1027ae7475eeeb10252c52b1e212", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=wNj6lFT4d7g" },
  { id: 37, title: "SF8 — 일주일 만에 사랑할 순 없다", category: "Film · Trailer", year: 2020, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/afa9e150-8a5b-44d2-93b8-5376efd8eafd_rwc_0x324x600x469x600.jpg?h=d34e938370bebf67052bf14c277085f0", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=je2Tf4gZB5k" },
  { id: 38, title: "매직펜던트 대모험", category: "Film · Trailer", year: 2020, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/e1e8983a-c45f-4de3-b935-d63828a2fe51_rwc_36x0x612x479x640.png?h=9f80ef9ab8103e1ca0b433ae3b9e88b8", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=tHVNpvBUzIE" },
  { id: 39, title: "Me and Me (사라진 시간)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/26dd737d-6cce-4862-aaa9-dc258f9922a2_rwc_0x309x1134x886x640.jpg?h=77b933b811e2d8dfb8e2b987f53e8efb", videoType: null },
  { id: 40, title: "Man of Men (퍼펙트맨)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/333301c3-b56d-418b-8992-67447ab2b52d_rwc_0x365x1912x1494x640.jpg?h=55eab54ce8ff34350e1670842688d768", videoType: null },
  { id: 41, title: "Juror8 (배심원들)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/aa86fc89-e407-4b67-85d6-8b62d8ab6540_rwc_0x1154x2000x1563x640.jpg?h=4f2ce3c203b2e56661e04570f82b2f7a", videoType: null },
  { id: 42, title: "Campeones (챔피언스)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/4eee645c-2acf-4d84-8552-7a53344787fd_rwc_0x116x1978x1546x640.jpg?h=e475f0d1c6c76765c851754fecbd5775", videoType: null },
  { id: 43, title: "一陽来復 (봄은 온다)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/183fd67d-eaab-4afc-b5ec-269eff9df295_rwc_0x336x2000x1563x640.jpg?h=f28e35e18a5389d4564bf2e308849ac2", videoType: null },
  { id: 44, title: "Greta (마담 싸이코)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/10756844-61de-4d85-988e-45a82149e26b_rwc_88x229x777x607x640.jpg?h=8262a61a573310d69a111faea3aca832", videoType: null },
  { id: 45, title: "My Punch Drunk Boxer (판소리 복서)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/16d2d328-a3e0-4b17-af38-d427ae229667_rwc_0x229x1400x1094x640.jpg?h=ce3dc3da5366d9e3f610253c5919a810", videoType: null },
  { id: 46, title: "Nightmare Cinema (나이트메어 시네마)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/b9677278-f543-481a-86a8-eecfb1fa785a_rwc_0x647x1978x1546x640.jpg?h=1e9459e0ec77fe6eda64a168caff94c0", videoType: null },
  { id: 47, title: "Jesters: The Game Changers (광대들: 풍문조작단)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/7f7f9f4b-553f-4991-9ddd-fcee46711270_rwc_0x318x1400x1094x640.jpg?h=bfcf297d1bc84bcdc10fe88b73f3fb0b", videoType: null },
  { id: 48, title: "Underdog (언더독)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/8212d18d-13dc-478e-ac7d-40dd9527b683_rwc_0x650x1326x1036x640.jpg?h=deb1a7e3e256bc703dce0a1af4fe803b", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=Xn7ur9jgaKU" },
  { id: 49, title: "Unfinished (출국)", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/29126579-f354-49f4-8f0b-1b6fcfb04cf3_rwc_0x174x1916x1497x640.jpg?h=e2aff5356a23a4ba09d5b4f297adfea2", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=Ep0_lUbtOJE" },
  { id: 50, title: "극장판 반지의 비밀일기", category: "Film · Trailer", year: 2019, thumbnail: "https://cdn.myportfolio.com/2c50ac03-4dcb-434d-9df4-1546617c566f/19aa9085-f67b-415c-a426-796b649b221d_rwc_0x490x2000x1563x640.jpg?h=48792e2f408a6cd101a16778d86d1bef", videoType: "youtube", videoUrl: "https://www.youtube.com/watch?v=BzsubtERrQk" },
];

export default async function Home() {
  const dbProjects = await getProjects();
  const projectList = dbProjects.length > 0 ? dbProjects : fallbackProjects;

  // Group by year
  const years = [...new Set(projectList.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Work</h1>
        <p className="text-muted text-sm">{projectList.length} Projects</p>
      </div>
      {years.map((year) => (
        <div key={year} className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-5 border-b border-border pb-2">{year}</h2>
          <ProjectGrid projects={projectList.filter((p) => p.year === year)} />
        </div>
      ))}
    </div>
  );
}
