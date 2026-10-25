/**
 * Hoạt Cảnh Kết Thúc Viên Mãn & Phần Danh Đề Tác Giả (Credits)
 * 1. Animation Phước và Trúc hôn nhau, dắt tay nhau dưới mưa cánh hoa hồng.
 * 2. Mỹ Nhi tỉnh ngộ và mỉm cười chúc hai người hạnh phúc.
 * 3. Hiển thị bảng CREDITS (Bạn có thể sửa trực tiếp tên tác giả ở hằng số GAME_CREDITS_CONFIG bên dưới!).
 */

import React, { useState } from 'react';
import { Heart, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getPhuocAvatar } from '../utils/avatarManager';
import portraitPhuocTrucReunited from '../assets/images/phuoc_truc_reunited_1792344680888.jpg';

/**
 * ============================================================================
 * CẤU HÌNH CREDITS / TÊN TÁC GIẢ (BẠN TỰ SỬA TÊN TÁC GIẢ TẠI ĐÂY NHÉ!)
 * ============================================================================
 */
export const GAME_CREDITS_CONFIG = {
  gameTitle: 'HÀNH TRÌNH PHƯỚC - CẦU SÔNG BUÔNG',
  authorName: '[TÊN TÁC GIẢ CỦA BẠN - SỬA TẠI ĐÂY]', // <-- BẠN SỬA TÊN TÁC GIẢ Ở DÒNG NÀY!
  storyAndScript: '[TÊN TÁC GIẢ KỊCH BẢN - SỬA TẠI ĐÂY]',
  characterDesign: 'Phước, Trúc, Mỹ Nhi, Bá Hộ Long, Boss Ý, Thuận, Thoại, Trường, CSGT',
  musicAndVoice: 'Lồng tiếng & Âm nhạc Tùy Chỉnh bởi Tác Giả',
  specialThanks: 'Cảm ơn tất cả người chơi đã đồng hành cùng mối tình đẹp của Phước & Trúc!',
  year: '2025',
};

interface EndingCutsceneModalProps {
  onFinishToVictory: () => void;
}

export const EndingCutsceneModal: React.FC<EndingCutsceneModalProps> = ({
  onFinishToVictory,
}) => {
  const [step, setStep] = useState<'kiss_and_blessing' | 'credits'>('kiss_and_blessing');
  const phuocAvatar = getPhuocAvatar();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md select-none overflow-y-auto">
      {step === 'kiss_and_blessing' ? (
        <div className="w-full max-w-3xl bg-stone-900 border-2 border-pink-500/70 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
          {/* Floating Rose Petals & Hearts Animation */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-300 font-extrabold text-xs tracking-wider mb-3">
            <Heart className="w-4 h-4 fill-pink-400 text-pink-400 animate-bounce" />
            <span>HOẠT CẢNH ĐOÀN TỤ: NỤ HÔN CHÂN TÌNH & LỜI CHÚC PHÚC CỦA MỸ NHI</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight mb-2">
            PHƯỚC & TRÚC HÔN NHAU – MỸ NHI CHÚC HAI NGƯỜI HẠNH PHÚC!
          </h2>

          {/* Animated Canvas Scene: Phước & Trúc Kissing + Holding Hands + Mỹ Nhi Blessing */}
          <div className="relative w-full bg-gradient-to-b from-indigo-950 via-purple-950 to-stone-950 border-2 border-amber-400/60 rounded-2xl p-6 my-3 flex flex-col md:flex-row items-center justify-around gap-6 shadow-inner">
            {/* Left/Center: Phước & Trúc Kissing and Holding Hands */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center gap-2">
                <img
                  src={phuocAvatar}
                  alt="Phước"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-emerald-400 shadow-lg transform translate-x-2"
                  referrerPolicy="no-referrer"
                />
                <div className="z-10 bg-rose-500 text-white p-2.5 rounded-full shadow-lg animate-pulse">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <img
                  src={portraitPhuocTrucReunited}
                  alt="Trúc"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-pink-400 shadow-lg transform -translate-x-2"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="mt-3 text-xs md:text-sm font-extrabold text-pink-300 flex items-center gap-1.5">
                💑 Phước & Trúc trao nhau nụ hôn ngọt ngào và nắm chặt tay nhau!
              </span>
            </div>

            {/* Right: Mỹ Nhi (White Dress & Pink Bouquet) Smiling & Blessing */}
            <div className="flex flex-col items-center bg-stone-900/90 border border-pink-400/40 rounded-2xl p-4 max-w-xs">
              <div className="text-2xl mb-1">👰🏻‍♀️🌹✨</div>
              <span className="text-xs font-black text-pink-300 uppercase tracking-wider">
                Mỹ Nhi (Đã buông bỏ chấp niệm)
              </span>
              <p className="text-xs text-stone-200 italic mt-1.5 leading-relaxed">
                "Nhìn anh Phước lấy thân mình đỡ từng cành hoa gai bảo vệ Trúc, em đã hiểu vì sao trái tim anh chỉ thuộc về cô ấy. Chúc hai người mãi mãi hạnh phúc bên nhau!"
              </p>
            </div>
          </div>

          {/* 3-Person Closing Dialogue Box */}
          <div className="w-full bg-stone-950/80 border border-stone-800 rounded-2xl p-4 text-left space-y-2.5 text-xs md:text-sm mb-5">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-400/40 text-pink-300 font-bold shrink-0">
                Mỹ Nhi:
              </span>
              <p className="text-stone-200 italic">
                "Phước à, Trúc à... Cho Mỹ Nhi xin lỗi vì cơn ghen mù quáng vừa rồi. Set son 500k năm xưa em sẽ giữ làm kỷ niệm đẹp. Chúc hai người trăm năm hạnh phúc!"
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold shrink-0">
                Phước:
              </span>
              <p className="text-stone-200 italic">
                "Cảm ơn Mỹ Nhi đã hiểu cho tụi anh. Chúc em cũng sẽ tìm được bến đỗ bình yên thật sự của đời mình!"
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-400/40 text-rose-300 font-bold shrink-0">
                Trúc:
              </span>
              <p className="text-stone-200 italic">
                "Cảm ơn chị Mỹ Nhi! Anh Phước ơi, nắm tay em thật chặt, mình cùng về lại Cầu Sông Buông thôi!"
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('credits')}
            className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-stone-950 font-black text-sm rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <Award className="w-5 h-5" />
            <span>Xem Bảng Vinh Danh Tác Giả (Credits)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* BẢNG CREDITS TÁC GIẢ */
        <div className="w-full max-w-2xl bg-stone-900 border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-extrabold text-xs tracking-widest mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>CREDITS · ĐỘI NGŨ SẢN XUẤT GAME</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-wide mb-1">
            {GAME_CREDITS_CONFIG.gameTitle}
          </h2>
          <p className="text-xs text-stone-400 mb-6">
            Bạn có thể chỉnh sửa trực tiếp tên tác giả trong file{' '}
            <code className="text-amber-300 bg-stone-950 px-1.5 py-0.5 rounded">
              src/components/EndingCutsceneModal.tsx
            </code>
          </p>

          <div className="w-full bg-stone-950/90 border border-stone-800 rounded-2xl p-5 space-y-4 mb-6 text-center">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">
                Đạo Diễn & Tác Giả Chính (Created By)
              </p>
              <p className="text-xl font-black text-amber-400 mt-0.5">
                {GAME_CREDITS_CONFIG.authorName}
              </p>
            </div>

            <div className="border-t border-stone-800/80 pt-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">
                Biên Kịch & Cốt Truyện
              </p>
              <p className="text-base font-bold text-emerald-300 mt-0.5">
                {GAME_CREDITS_CONFIG.storyAndScript}
              </p>
            </div>

            <div className="border-t border-stone-800/80 pt-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">
                Dàn Nhân Vật Đồng Hành
              </p>
              <p className="text-xs font-semibold text-stone-200 mt-1">
                {GAME_CREDITS_CONFIG.characterDesign}
              </p>
            </div>

            <div className="border-t border-stone-800/80 pt-3">
              <p className="text-[11px] uppercase tracking-widest text-stone-400 font-bold">
                Âm Nhạc & Lồng Tiếng
              </p>
              <p className="text-xs font-semibold text-sky-300 mt-1">
                {GAME_CREDITS_CONFIG.musicAndVoice}
              </p>
            </div>

            <div className="border-t border-stone-800/80 pt-3">
              <p className="text-xs text-pink-300 italic">
                "{GAME_CREDITS_CONFIG.specialThanks}"
              </p>
            </div>
          </div>

          <button
            onClick={onFinishToVictory}
            className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Đến Màn Hình Tổng Kết Chiến Thắng (End Game)</span>
          </button>
        </div>
      )}
    </div>
  );
};