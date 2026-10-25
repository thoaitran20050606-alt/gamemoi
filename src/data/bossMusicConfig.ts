/**
 * ============================================================================
 * TRUNG TÂM QUẢN LÝ NHẠC NỀN ĐÁNH BOSS (BOSS MUSIC CONFIG)
 * ============================================================================
 */
import Bosstruong from '../assets/audio/nhacboss/bos truong.mp3';
import csgt from '../assets/audio/nhacboss/csgt.mp3';
import Long from '../assets/audio/nhacboss/long.mp3';
import long1 from '../assets/audio/nhacboss/long1.mp3';
import mynhi1 from '../assets/audio/nhacboss/mynhi1.mp3';
import long2 from '../assets/audio/nhacboss/long2.mp3';

export interface BossMusicItem {
  id: 'truong' | 'csgt' | 'y' | 'baholong' | 'baholong_enraged' | 'mynhi' | 'mynhi_enraged';
  name: string;
  stageName: string;
  bgm: string; // <-- ĐIỀN ĐƯỜNG DẪN / TÊN FILE NHẠC TẠI ĐÂY
}

export const BOSS_MUSIC_CONFIG: Record<string, BossMusicItem> = {
  // 1. Mini-Boss Trường - Trùm Bắt Nạt Trộm Dép (THPT Tam Phước - Màn 1)
  truong: {
    id: 'truong',
    name: 'Trường (THPT Tam Phước)',
    stageName: 'Màn 1: Trường THPT Tam Phước',
    bgm: Bosstruong,
  },

  // 2. Mini-Boss Trưởng Trạm CSGT Tuần Tra (Phố Huyện - Màn 2)
  csgt: {
    id: 'csgt',
    name: 'Trưởng Trạm CSGT Tuần Tra',
    stageName: 'Màn 2: Phố Huyện Trạm CSGT',
    bgm: csgt,
  },

  // 3. Boss Ý - Trà Sữa & Mưa Tiền 50K (Cổng Dinh Cơ - Màn 3)
  y: {
    id: 'y',
    name: 'Boss Ý',
    stageName: 'Màn 3: Cổng Dinh Cơ - Giải Cứu Thuận',
    bgm: '',
  },

  // 4. Boss Bá Hộ Long (Đại Lộ Sài Gòn - Màn 4)
  baholong: {
    id: 'baholong',
    name: 'Bá Hộ Long',
    stageName: 'Màn 4: Đại Lộ Sài Gòn',
    bgm: long2,
  },

  // 5. Bá Hộ Long Khi Nổi Điên Cuồng Nộ (Phase 2 dưới 50% HP)
  baholong_enraged: {
    id: 'baholong_enraged',
    name: 'Bá Hộ Long (Cuồng Nộ Enraged)',
    stageName: 'Màn 4: Bá Hộ Long Bão Tiền & Xúc Xắc',
    bgm: Long,
  },

  // 6. Trùm Cuối Thực Sự: Boss Mỹ Nhi (Người Yêu Cũ - Set Son 500k) - Dạng 1
  mynhi: {
    id: 'mynhi',
    name: 'Boss Mỹ Nhi (Hoa Hồng Phấn)',
    stageName: 'Màn 5: Thánh Đường Hoa Hồng - Bảo Vệ Trúc',
    bgm: mynhi1, // <-- Tự thêm nhạc tại đây nếu muốn
  },

  // 7. Boss Mỹ Nhi Dạng 2 (Hồi Sinh Hóa Điên - Hoa Hồng Đẫm Máu)
  mynhi_enraged: {
    id: 'mynhi_enraged',
    name: 'Boss Mỹ Nhi (Hồi Sinh Hóa Điên - Dạng 2)',
    stageName: 'Màn 5: Bão Gai Hoa Hồng Đẫm Máu',
    bgm: long1, // <-- Tự thêm nhạc tại đây nếu muốn
  },
};

/**
 * Lấy đường dẫn file nhạc cho boss cụ thể
 */
export function getBossCustomBgm(bossId: string): string | undefined {
  const item = BOSS_MUSIC_CONFIG[bossId];
  if (!item || !item.bgm || typeof item.bgm !== 'string') return undefined;
  const trimmed = item.bgm.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}