/**
 * ============================================================================
 * TRUNG TÂM QUẢN LÝ DỮ LIỆU HỘI THOẠI & ÂM THANH LỒNG TIẾNG (STORY DIALOGUES)
 * ============================================================================
 */

import { StoryDialogueLine } from '../types/game';
import chaoEmVoice from '../assets/audio/chaoem.mp3';
import congkhoaVoice from '../assets/audio/congkhoa.mp3';
import duoclamVoice from '../assets/audio/duoclam.mp3';
import truongdauVoice from '../assets/audio/truongdau.mp3';
import camonVoice from '../assets/audio/camon.mp3';
import trucoiVoice from '../assets/audio/trucoi.mp3';
import ynaoVoice from '../assets/audio/ynao.mp3';
import cuongbaoVoice from '../assets/audio/cuongbao.mp3';
import setsonVoice from '../assets/audio/setson.mp3';
import colenVoice from '../assets/audio/truc/colen.mp3';
import lamduocVoice from '../assets/audio/truc/lamduoc.mp3';
import dunglamVoice from '../assets/audio/truc/dunglam.mp3';
import cauVoice from '../assets/audio/csgt/cau.mp3';
import thuachuVoice from '../assets/audio/csgt/thuachu.mp3';

// ----------------------------------------------------------------------------
// 1. MÀN 1: HỘI THOẠI THOẠI & TRƯỜNG (CẦU SÔNG BUÔNG & THPT TAM PHƯỚC)
// ----------------------------------------------------------------------------

export const THOAI_INTRO_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Chào em! Em có thấy Bá Hộ Long bắt cóc cô em Trúc chạy qua ngả nào không?!',
    audio: chaoEmVoice,
  },
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Hức hức... Em chào anh Phước! Em thấy Bá Hộ Long vừa phóng xe máy qua cầu chạy về hướng Phố Huyện rồi! Nhưng cổng cầu phía trước đã bị khóa chặt rồi ạ...',
    audio: '/assets/audio/chaoem.mp3',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Cổng bị khóa sao?! Làm cách nào để mở được khóa em ơi?',
    audio: congkhoaVoice,
  },
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Em có giữ chiếc chìa khóa cổng Cầu Sông Buông... Nhưng vừa nãy em bị tên đại ca Trường - trùm bắt nạt ở Trường THPT Tam Phước chặn đường cướp mất đôi dép của em! Hắn còn bắt em đi chân đất...',
    audio: '',
  },
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Nếu anh Phước bước qua cánh cửa kế bên vào trường THPT Tam Phước đánh bại Trường giành lại đôi dép cho em, em sẽ trao chiếc chìa khóa cổng để anh qua Màn 2 cứu chị Trúc ngay lập tức!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Được lắm! Dám bắt nạt học sinh, lại còn cướp dép! Em yên tâm, anh sẽ dạy cho tên Trường một bài học và lấy lại dép cho em!',
    audio: duoclamVoice,
  },
];

export const THOAI_WAITING_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Tên Trường đang ở trong sân trường THPT Tam Phước qua cánh cửa bên cạnh kìa anh Phước! Anh cẩn thận các chiêu ném dép tổ ong của hắn nha!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Yên tâm! Anh sẽ quét sạch bất công và lấy lại dép cho em!',
    audio: '',
  },
];

export const TRUONG_INTRO_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trường (Trùm Bắt Nạt)',
    role: 'truong',
    text: 'Thằng nào dám bước vào sân trường THPT Tam Phước làm phiền tao?! Đôi dép tổ ong huyền thoại của thằng Thoại giờ là chiến lợi phẩm của tao rồi!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Trường đâu mau trả dép lại cho Thoại',
    audio: truongdauVoice,
  },
];

export const TRUONG_DEFEATED_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trường',
    role: 'truong',
    text: 'Ui da! Tha cho tớ... Tiếng hô BECAUSE của cậu lý lẽ chặt chẽ và chói tai quá! Tớ xin chừa, tớ trả lại dép cho Thoại đây!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Nhớ lấy bài học này! Từ nay về sau phải biết đoàn kết, giúp đỡ bạn bè cùng trường!',
    audio: '',
  },
];

export const THOAI_RETURN_SLIPPERS_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Thoại ơi! Anh đã đánh bại tên Trường và đòi lại đôi dép cho em rồi đây!',
    audio: '',
  },
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Ôi trời ơi, đúng là đôi dép của em rồi! Em cảm ơn anh Phước rất nhiều! Anh đúng là anh hùng nghĩa hiệp!',
    audio: '',
  },
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Em xin trao cho anh CHÌA KHÓA CỔNG CẦU SÔNG BUÔNG 🗝️! Cổng ở cuối sông đã mở rồi, anh mau sang Màn 2 - Phố Huyện để cứu chị Trúc nhé!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Cảm ơn em,Anh đi cứu trúc đây!',
    audio: camonVoice,
  },
];

export const THOAI_COMPLETED_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Thoại',
    role: 'thoai',
    text: 'Cổng Cầu Sông Buông ở cuối sông đã mở rồi anh Phước ơi! Chúc anh sớm đoàn tụ cùng chị Trúc!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Cảm ơn em! Anh đi cứu Trúc đây!',
    audio: '',
  },
];

// ----------------------------------------------------------------------------
// 2. MÀN 2: HỘI THOẠI TRƯỞNG TRẠM CSGT TẠI PHỐ HUYỆN
// ----------------------------------------------------------------------------

export const CSGT_50_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trưởng Trạm CSGT',
    role: 'csgt',
    text: 'Cậu thanh niên này ăn nói lý lẽ đanh thép quá! Nhưng phố huyện có kỷ cương, ta phải dùng đạn chùm kiểm tra bản lĩnh!',
    audio: cauVoice,
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Thưa chú, tình yêu chân chính không bao giờ khuất phục! Cháu quyết giải cứu cô Trúc bằng mọi giá! BECAUSE!',
    audio: thuachuVoice,
  },
];

// ----------------------------------------------------------------------------
// 3. MÀN 4: HỘI THOẠI ĐẠI CHIẾN BÁ HỘ LONG (ĐẠI LỘ SÀI GÒN ĐÊM)
// ----------------------------------------------------------------------------

export const BAHOLONG_30_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long',
    role: 'baholong',
    text: 'Tao giàu nứt đố đổ vách, còn mày thì có cái gì?! Mày chỉ có mỗi set son 500k thôi!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Set son 500k của tao là tấm lòng chân thành, còn cả núi tiền của mày chỉ là đồ vô cảm! Chân lý là đây: BECAUSE!',
    audio: setsonVoice,
  },
  {
    speaker: 'Trúc',
    role: 'truc',
    text: 'Anh Phước nói đúng lắm! Tôi chỉ yêu người chân thành như anh Phước thôi!',
    audio: dunglamVoice,
  },
];

export const BAHOLONG_50_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long',
    role: 'baholong',
    text: 'Mẹ kiếp, tao nổi điên rồi! Bão 3 xúc xắc cuồng nộ và lốc tiền đô la của tao sẽ chôn vùi mày tại đây!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Càng cuồng bạo thì càng lộ rõ sự đuối lý! Hãy đối mặt với tiếng thét công lý... BECAUSE!',
    audio: cuongbaoVoice,
  },
];

export const BAHOLONG_70_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long',
    role: 'baholong',
    text: 'Mày... mày đi yêu con Ý đi! Đừng giành Trúc của tao nữa mà! Tao chia cho mày cả vali tiền đô la!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Ý nào ở đây?! Trái tim tao trước sau như một chỉ yêu duy nhất mình Trúc! Đừng hòng mang tiền ra mua chuộc!',
    audio: ynaoVoice,
  },
  {
    speaker: 'Trúc',
    role: 'truc',
    text: 'Anh Phước cố lên! Hắn sắp gục ngã rồi!',
    audio: colenVoice,
  },
];

export const BAHOLONG_100_DEFEATED_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long',
    role: 'baholong',
    text: 'Đừng đánh nữa mà... Long xin lỗi! Long biết lỗi thật rồi! Từ nay Long xin chừa, không dám ức hiếp ai nữa!',
    audio: '',
  },
  {
    speaker: 'Trúc',
    role: 'truc',
    text: 'Anh Phước ơi! Anh đã làm được rồi, anh đã đánh bại kẻ xấu cứu em!',
    audio: lamduocVoice,
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Trúc ơi, em bình an là điều tuyệt vời nhất! Nắm tay anh, chúng mình cùng đi tiếp về dòng Sông Buông êm đềm nhé!',
    audio: trucoiVoice,
  },
];

// ----------------------------------------------------------------------------
// 4. MÀN THẮNG (VICTORY MODAL): ĐỐI THOẠI HẬU TRUYỆN ĐOÀN TỤ
// ----------------------------------------------------------------------------

export const VICTORY_EPILOGUE_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Mỹ Nhi (mỉm cười chúc phúc)',
    role: 'mynhi',
    text: 'Nhìn anh Phước bất chấp nguy hiểm đỡ từng nhát gai hoa hồng che chở cho Trúc, em đã thực sự tâm phục khẩu phục. Chúc anh Phước và Trúc trọn đời hạnh phúc bên nhau!',
    audio: '',
  },
  {
    speaker: 'Phước (nắm chặt tay Trúc)',
    role: 'phuoc',
    text: 'Cảm ơn Mỹ Nhi! Mọi sóng gió đã qua rồi. Hãy nhớ lấy: BECAUSE chính nghĩa và tình yêu chân thành sẽ luôn luôn chiến thắng!',
    audio: '',
  },
  {
    speaker: 'Trúc (rạng rỡ nép vào Phước)',
    role: 'truc',
    text: 'Cảm ơn anh Phước đã vì em mà băng qua ngàn trùng gian nan và bảo vệ em tới giây phút cuối cùng! Em nguyện trọn đời trọn kiếp chung thủy bên anh!',
    audio: '',
  },
];

// ----------------------------------------------------------------------------
// 5. CÁC ĐOẠN HỘI THOẠI TRONG TRANH CỐT TRUYỆN (STORY CUTSCENES)
// ----------------------------------------------------------------------------

export const CUTSCENE_INTRO_HOI1_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Trúc ơi, nước sông hôm nay trong mát quá, đàn rái cá cứ lội theo thuyền quấn quýt. Cầu mong hai đứa mình mãi yên ả bên nhau thế này.',
    audio: '',
  },
  {
    speaker: 'Trúc',
    role: 'truc',
    text: 'Dạ anh Phước! Dù bữa cơm chỉ có mớ rau con cá anh bắt bên sông, em cũng thấy ngọt ngào hơn vạn lần nhung lụa xa hoa.',
    audio: '',
  },
];

export const CUTSCENE_INTRO_HOI2_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long',
    role: 'baholong',
    text: 'Hahaha! Khắp vùng sông Buông này hóa ra lại giấu một bông hoa xinh đẹp thế này! Này Trúc, mày theo thằng nghèo kiết xác chài lưới này làm gì cho mạt kiếp? Mau theo Bá Hộ Long tao về Dinh thự, vàng đeo gãy cổ, ăn sung mặc sướng!',
    audio: '',
  },
  {
    speaker: 'Trúc (đanh thép)',
    role: 'truc',
    text: 'Anh tự trọng đi! Tiền bạc của anh dơ bẩn lắm! Tôi thà ăn rau uống nước lã bên anh Phước chứ không bao giờ thèm bước chân vào dinh thự của kẻ như anh!',
    audio: '',
  },
];

export const CUTSCENE_INTRO_HOI3_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long (quát tháo)',
    role: 'baholong',
    text: 'Con khốn ranh con! Mày dám chê tiền của tao à?! Thằng Phước chỉ có mỗi set son 500k mà mày cũng mê được?! Tùy tùng đâu, trói gô nó lại ném lên xe máy cho tao! Kích động bầy rái cá cắn nát chân thằng Phước nếu nó dám đuổi theo!',
    audio: '',
  },
  {
    speaker: 'Trúc (hoảng sợ kêu cứu)',
    role: 'truc',
    text: 'Anh Phước ơi!! Cứu em với!! Buông tôi ra... đồ ác độc... Anh Phước mau cứu em...!!',
    audio: '',
  },
  {
    speaker: 'Phước (phẫn nộ)',
    role: 'phuoc',
    text: 'Bá Hộ Long!! Ban ngày ban mặt ngươi dám cướp người à?! Thả Trúc ra ngay, tao không tha cho mày đâu!!',
    audio: '',
  },
];

export const CUTSCENE_INTRO_HOI4_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Phước (Lời thề)',
    role: 'phuoc',
    text: 'Trúc! Hãy đợi anh! Dù phải băng qua ngàn trùng sông nước, đạp bẹp bầy rái cá hay đối đầu bất cứ ai, anh thề sẽ đánh bại Bá Hộ Long và đưa em trở về bình an!',
    audio: '',
  },
];

export const CUTSCENE_LEVEL2_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'CSGT',
    role: 'csgt',
    text: 'Đứng lại! Ai cho phép cậu chạy bạt mạng, nhảy nhót gây mất trật tự công cộng trong khu phố huyện?! Xuất trình giấy tờ, giơ tay lên đầu hàng!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Thưa chú CSGT! Cháu đang khẩn cấp giải cứu cô Trúc bị tên Bá Hộ Long cậy giàu bắt cóc! Cháu có lý do hoàn toàn chính đáng... BECAUSE!',
    audio: '',
  },
];

export const CUTSCENE_LEVEL3_TE_XE_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long (lồm cồm bò dậy xoa mông)',
    role: 'baholong',
    text: 'Ối giời ôi mẹ ơi té xe rồi! Nát bét con xe tay ga mấy trăm triệu của tao rồi! Cái lưng, cái mông tao đau thấu trời! Thằng Phước kia, sao mày bám dai như đỉa đói vậy hả?!',
    audio: '',
  },
  {
    speaker: 'Phước (thắng gấp mô tô, bước xuống đanh thép)',
    role: 'phuoc',
    text: 'Bá Hộ Long! Chạy nhanh vượt ẩu, lạng lách trên dải phân cách thì té xe là quả báo nhãn tiền! Mau buông tha Trúc ra ngay!',
    audio: '',
  },
  {
    speaker: 'Trúc (được Phước đỡ dậy mừng rỡ)',
    role: 'truc',
    text: 'Anh Phước! May quá chiếc xe ngã em văng vào bãi cỏ chỉ bị xây xát nhẹ! Anh bắt hắn đền tội đi!',
    audio: '',
  },
  {
    speaker: 'Bá Hộ Long (lùi vào cổng dinh cơ)',
    role: 'baholong',
    text: 'Mẹ kiếp! Đừng tưởng tao té xe là hết cách! Toàn bộ lính rái cá tinh nhuệ hộ vệ đâu, mau kích hoạt bẫy đầm sen gai góc, bè bèo trơn trượt ngăn chân thằng Phước lại cho tao!',
    audio: '',
  },
];

export const CUTSCENE_LEVEL3_CONG_DINH_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trúc (nhắn nhủ từ xa)',
    role: 'truc',
    text: 'Anh Phước ơi cẩn thận các bè bèo chuyển động và mái ngói trơn trượt! Trên mái ngói có Trái Tim hồi máu đó anh!',
    audio: '',
  },
];

export const CUTSCENE_LEVEL4_TRUC_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trúc (đứng bên lan can)',
    role: 'truc',
    text: 'Anh Phước cố lên! Hãy đập tan thói cậy giàu sang ức hiếp người khác của hắn!',
    audio: '',
  },
];

export const CUTSCENE_LEVEL4_BEFORE_BATTLE_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Bá Hộ Long (gầm rú)',
    role: 'baholong',
    text: 'Mẹ kiếp! Mày ép tao vào đường cùng hả Phước?! Nhìn lại mình xem, mày chỉ là thằng nghèo chài lưới ven sông Buông, lấy tư cách gì tranh giành Trúc với tao?! Tao giàu nứt đố đổ vách, mày có cái gì?!',
    audio: '',
  },
  {
    speaker: 'Phước (đanh thép)',
    role: 'phuoc',
    text: 'Bá Hộ Long! Tiền tài của mày có chất cao như núi cũng không bao giờ mua được trái tim chân thành! Đừng hòng cậy tiền ép người! Hãy đón nhận sức mạnh của chân lý... BECAUSE!',
    audio: '',
  },
  {
    speaker: 'Bá Hộ Long (rút xúc xắc cười man dại)',
    role: 'baholong',
    text: 'Nực cười! Trên đời này cái gì không mua được bằng tiền thì sẽ mua được bằng RẤT NHIỀU TIỀN! Bão đô la và xúc xắc ma thuật của tao sẽ chôn vùi mày tại đây!',
    audio: '',
  },
];

// ----------------------------------------------------------------------------
// 6. MÀN 3: ĐỐI THOẠI 3 NGƯỜI (PHƯỚC, THUẬN, BOSS Ý - TRÀ SỮA & 50K)
// ----------------------------------------------------------------------------

export const Y_INTRO_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Thuận (hớt hải, bầm dập)',
    role: 'thuan',
    text: 'Phước ơi cứu tao với! Con Ý nó tìm không ra mày nên đập tao tơi tả ép tao phải dẫn đường đến gặp mày đây nè!',
    audio: '',
  },
  {
    speaker: 'Ý (mũ tai gấu, hờn dỗi)',
    role: 'y',
    text: 'Phước! Cuối cùng em cũng tìm được anh rồi! Anh còn nhớ chuyện cũ không?! Xưa anh từng ngỏ lời tỏ tình với em... Lúc đó em từ chối là em sai, giờ em hối hận muốn quay lại với anh rồi!',
    audio: '',
  },
  {
    speaker: 'Ý (xòe tiền & trà sữa)',
    role: 'y',
    text: 'Anh nhìn xem, em mua sẵn trà sữa trân châu và cả cọc tiền 50K cho anh đây này! Anh hãy bỏ con Trúc đi rồi theo em về lại đi mà!',
    audio: '',
  },
  {
    speaker: 'Thuận (cảnh báo)',
    role: 'thuan',
    text: 'Phước ơi tỉnh táo lại đi! Lúc nãy nó vừa đánh tao bầm dập dã man chỉ để tra khảo tung tích của mày đấy! Đừng tin lời nó!',
    audio: '',
  },
  {
    speaker: 'Phước (đanh thép, chung tình)',
    role: 'phuoc',
    text: 'Ý ơi, chuyện xưa đã qua từ lâu rồi! Khi xưa em chê anh nghèo rồi từ chối phũ phàng, giờ anh đã có Trúc là người con gái chân tình cùng anh đồng cam cộng khổ! Trái tim anh trước sau như một chỉ yêu duy nhất mình Trúc! Mau trả chìa khóa cổng Dinh Cơ cho anh qua Màn 4 cứu Trúc!',
    audio: ynaoVoice,
  },
  {
    speaker: 'Ý (tức giận giẫm chân)',
    role: 'y',
    text: 'Cái gì?! Em đã hạ mình van xin thế này mà anh dám từ chối em để đi cứu con Trúc sao?! Được lắm, không ngọt ngào được thì em sẽ dùng Ly Trà Sữa, Bão Trân Châu và Mưa Tiền 50K ép anh phải đổi ý!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Thuận lùi lại phía sau để tao bảo vệ! Sức mạnh tình yêu chân chính không bao giờ bị mua chuộc bởi trà sữa hay tiền bạc! BECAUSE!',
    audio: '',
  },
];

export const Y_50_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Ý (thở dốc, nổi giận)',
    role: 'y',
    text: 'Em vừa mua thêm bão trà sữa trân châu full topping và xòe quạt tiền 50k đây! Anh Phước mau hồi tâm chuyển ý quay về bên em đi!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Vô ích thôi Ý! Trái tim anh chỉ trao trọn cho Trúc! Dù có cả biển trà sữa hay núi tiền 50k cũng không lay chuyển được anh! BECAUSE!',
    audio: '',
  },
  {
    speaker: 'Thuận (cổ vũ)',
    role: 'thuan',
    text: 'Phước nói chí lý lắm! Cố lên Phước ơi, né ly trà sữa với trân châu đang bay kìa!',
    audio: '',
  },
];

export const Y_DEFEATED_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Ý (khóc sụt sùi, quỳ gục)',
    role: 'y',
    text: 'Hức hức... Em thua rồi... Giờ em mới nhận ra ngày xưa em đánh mất một người chân thành như anh Phước là sai lầm lớn nhất đời em... Anh và Trúc đúng là sinh ra để dành cho nhau...',
    audio: '',
  },
  {
    speaker: 'Ý',
    role: 'y',
    text: 'Em xin trao lại chiếc CHÌA KHÓA CỔNG DINH CƠ 🗝️ đây... Anh mau sang Màn 4 (Đại Lộ Sài Gòn) giải cứu chị Trúc khỏi tay Bá Hộ Long đi...',
    audio: '',
  },
  {
    speaker: 'Thuận (vui mừng reo lên)',
    role: 'thuan',
    text: 'Được cứu rồi! Phước ơi mày đúng là anh hùng! Đã có chìa khóa cổng rồi, mau phóng lên Đại Lộ Sài Gòn dạy cho tên Bá Hộ Long một bài học cứu cô Trúc thôi!',
    audio: '',
  },
  {
    speaker: 'Phước',
    role: 'phuoc',
    text: 'Cảm ơn Thuận đã kiên cường! Ý ơi, mong em sẽ sớm hiểu ra và tìm được người thực sự yêu thương em. Tạm biệt, anh đi cứu Trúc đây!',
    audio: '',
  },
];

// ----------------------------------------------------------------------------
// 7. MÀN 5 (MÀN CUỐI): ĐỐI THOẠI 3 NGƯỜI (PHƯỚC, TRÚC, BOSS MỸ NHI - SET SON 500K)
// ----------------------------------------------------------------------------

export const CUTSCENE_LEVEL5_WALKING_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Trúc (nắm tay Phước mỉm cười)',
    role: 'truc',
    text: 'Anh Phước ơi, cuối cùng tên Bá Hộ Long cũng bị đánh bại rồi! Nắm tay anh đi dưới ánh trăng thế này, em cứ ngỡ như đang mơ vậy...',
    audio: '',
  },
  {
    speaker: 'Phước (siết nhẹ tay Trúc)',
    role: 'phuoc',
    text: 'Không phải mơ đâu Trúc à! Từ nay không ai có thể chia cắt hai đứa mình nữa. Mình cùng nhau đi tiếp về quê hương Sông Buông thôi!',
    audio: '',
  },
];

export const MYNHI_INTRO_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Mỹ Nhi (bất ngờ xuất hiện chặn đường)',
    role: 'mynhi',
    text: 'Đứng lại đó Phước!! Anh tưởng đánh bại Bá Hộ Long xong là có thể yên ổn dắt tay con nhỏ Trúc này đi dễ dàng vậy sao?!',
    audio: '',
  },
  {
    speaker: 'Phước (sững sờ)',
    role: 'phuoc',
    text: 'Mỹ Nhi?! Sao em lại xuất hiện ở đây?! Chuyện tình cảm giữa chúng ta đã kết thúc từ lâu rồi mà!',
    audio: '',
  },
  {
    speaker: 'Mỹ Nhi (cầm bó hoa hồng, uất ức)',
    role: 'mynhi',
    text: 'Kết thúc ư?! Anh nhìn đôi môi em đi! Đây là màu của SET SON 500K mà ngày xưa anh nhịn ăn nhịn mặc mua tặng em! Vậy mà giờ đây, anh lại vì con Trúc mà băng qua sông sâu, vượt bao nguy hiểm?!',
    audio: '',
  },
  {
    speaker: 'Trúc (lo lắng nép sau lưng Phước)',
    role: 'truc',
    text: 'Chị Mỹ Nhi ơi... Ngày xưa chính chị là người đã bỏ rơi anh Phước lúc anh ấy nghèo khó cơ mà! Sao bây giờ chị lại trách anh ấy?!',
    audio: '',
  },
  {
    speaker: 'Mỹ Nhi (ghen tỵ tột độ)',
    role: 'mynhi',
    text: 'Im ngay!! Tất cả là tại mày! Nếu không có sự xuất hiện của mày thì Phước vẫn mãi nhớ về tao! Hôm nay tao sẽ dùng Bão Hoa Hồng vùi dập mày để Phước phải nếm trải nỗi đau mất đi người mình yêu nhất!',
    audio: '',
  },
  {
    speaker: 'Phước (đứng chắn trước Trúc, kiên quyết)',
    role: 'phuoc',
    text: 'Trúc đứng lùi lại phía sau anh! Mỹ Nhi, set son 500k năm xưa là kỷ niệm quá khứ, còn hiện tại và tương lai của anh chỉ có duy nhất mình Trúc! Anh tuyệt đối không để em làm hại Trúc dù chỉ một sợi tóc! BECAUSE!',
    audio: setsonVoice,
  },
];

export const MYNHI_REVIVE_PHASE2_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Mỹ Nhi (HỒI SINH HÓA ĐIÊN - Mắt đỏ rực, hoa hồng nhuốm máu)',
    role: 'mynhi',
    text: 'ÁAAA!! Đừng tưởng đánh cạn máu tao là xong!! Lòng đố kỵ và hận tình đã giúp tao HỒI SINH ĐẦY 100% MÁU SANG DẠNG 2! Hoa hồng trắng đã nhuốm máu, Bão Gai Máu của tao sẽ xuyên thủng con Trúc!',
    audio: '',
  },
  {
    speaker: 'Trúc (hoảng hốt)',
    role: 'truc',
    text: 'Anh Phước cẩn thận! Chị ta hồi sinh hóa điên rồi, những bông hoa hồng đẫm máu đang nhắm thẳng vào em kìa! (Em chỉ có 50 HP thôi!)',
    audio: colenVoice,
  },
  {
    speaker: 'Phước (bật khiên Parry rực sáng)',
    role: 'phuoc',
    text: 'Đừng sợ Trúc ơi! Anh sẽ dùng Khiên Đỡ Đòn (PARRY - Phím C) chặn đứng mọi cành hoa máu bay về phía em và phản đòn đánh bại cơn cuồng nộ này!',
    audio: cuongbaoVoice,
  },
];

export const MYNHI_DEFEATED_DIALOGUES: StoryDialogueLine[] = [
  {
    speaker: 'Mỹ Nhi (ngã quỵ, hoa máu tan biến trở lại thành hoa hồng trắng)',
    role: 'mynhi',
    text: 'Hức... Cơn cuồng nộ của em tan biến rồi... Dù em có phóng bao nhiêu gai nhọn, anh Phước vẫn lấy thân mình đỡ hết cho Trúc... Em thực sự thua tấm chân tình của hai người rồi...',
    audio: '',
  },
  {
    speaker: 'Mỹ Nhi (mỉm cười buông bỏ)',
    role: 'mynhi',
    text: 'Phước à, Trúc à... Cho Mỹ Nhi xin lỗi vì sự ích kỷ vừa qua. Hai người xứng đáng có được hạnh phúc trọn vẹn nhất. Mỹ Nhi thật lòng chúc hai người trăm năm hạnh phúc!',
    audio: '',
  },
  {
    speaker: 'Phước & Trúc',
    role: 'phuoc',
    text: 'Cảm ơn Mỹ Nhi đã hiểu ra! Chúc em sớm tìm được hạnh phúc mới của riêng mình!',
    audio: '',
  },
];

/**
 * Tra cứu danh sách câu thoại theo mã stage trong game
 */
export function getStoryEventLines(stage: string): StoryDialogueLine[] {
  switch (stage) {
    case 'thoai_intro':
      return THOAI_INTRO_DIALOGUES;
    case 'thoai_waiting':
      return THOAI_WAITING_DIALOGUES;
    case 'truong_intro':
      return TRUONG_INTRO_DIALOGUES;
    case 'truong_defeated':
      return TRUONG_DEFEATED_DIALOGUES;
    case 'thoai_return_slippers':
      return THOAI_RETURN_SLIPPERS_DIALOGUES;
    case 'thoai_completed':
      return THOAI_COMPLETED_DIALOGUES;
    case 'phase_csgt_50':
      return CSGT_50_DIALOGUES;
    case 'y_intro':
      return Y_INTRO_DIALOGUES;
    case 'y_50':
      return Y_50_DIALOGUES;
    case 'y_defeated':
      return Y_DEFEATED_DIALOGUES;
    case 'phase1_30':
      return BAHOLONG_30_DIALOGUES;
    case 'phase_long_50':
      return BAHOLONG_50_DIALOGUES;
    case 'phase2_70':
      return BAHOLONG_70_DIALOGUES;
    case 'phase3_100':
      return BAHOLONG_100_DEFEATED_DIALOGUES;
    case 'mynhi_intro':
      return MYNHI_INTRO_DIALOGUES;
    case 'mynhi_revive_phase2':
      return MYNHI_REVIVE_PHASE2_DIALOGUES;
    case 'mynhi_defeated':
      return MYNHI_DEFEATED_DIALOGUES;
    default:
      return [];
  }
}