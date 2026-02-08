/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { apiKolBooking } from '@/services/kol/kol';

interface KolListProps {
	kolList: API.KolListItem[];
	placeId: string;
	placeName: string;
}

export default function KolList({ kolList, placeId, placeName }: KolListProps) {
	const [selectedKol, setSelectedKol] = useState<API.KolListItem | null>(null);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [bookingForm, setBookingForm] = useState({
		userName: '',
		userEmail: '',
		userPhone: '',
		reviewType: 'mixed' as 'photo' | 'video' | 'story' | 'mixed',
		notes: '',
		budget: 0,
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const handleBooking = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedKol) return;

		setLoading(true);
		try {
			const result = await apiKolBooking({
				placeId,
				kolId: selectedKol.id,
				userName: bookingForm.userName,
				userEmail: bookingForm.userEmail,
				userPhone: bookingForm.userPhone,
				reviewType: bookingForm.reviewType,
				notes: bookingForm.notes,
				budget: bookingForm.budget,
			});

			if (result.succeeded) {
				setMessage('✓ Đặt KOL thành công! Chúng tôi sẽ liên hệ bạn sớm.');
				setShowBookingForm(false);
				setSelectedKol(null);
				setBookingForm({
					userName: '',
					userEmail: '',
					userPhone: '',
					reviewType: 'mixed',
					notes: '',
					budget: 0,
				});
				setTimeout(() => setMessage(''), 3000);
			} else {
				setMessage('✗ Có lỗi xảy ra. Vui lòng thử lại.');
			}
		} catch {
			setMessage('✗ Đặt KOL thất bại. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	if (kolList.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex items-center gap-3 mb-4">
					<div className="text-2xl">⭐</div>
					<div>
						<p className="text-xs uppercase tracking-[0.08em] text-slate-500">Dịch vụ KOL</p>
						<h2 className="text-2xl font-semibold text-slate-900">Danh sách KOL review</h2>
					</div>
				</div>
				<p className="text-sm text-slate-600">Chọn KOL để tạo bài review chuyên nghiệp cho {placeName}</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{kolList.map((kol) => (
					<div
						key={kol.id}
						className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
					>
						{/* Avatar */}
						<div className="relative h-40 w-full bg-gradient-to-br from-indigo-100 to-slate-100 overflow-hidden">
							{kol.avatar ? (
								<img
									src={kol.avatar}
									alt={kol.name}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-5xl">👤</div>
							)}
							{kol.verified && (
								<div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
										<path fillRule="evenodd" d="M16.403 12.402l1.07-3.196a.75.75 0 00-1.440-.406l-.3.9a.75.75 0 01-.85.5.75.75 0 00-.614-.614.75.75 0 00-.406 1.44l.9.3a.75.75 0 01.5.85 .75.75 0 00.614.614.75.75 0 00.406-1.44l-.3-.9a.75.75 0 01-.5-.85.75.75 0 00-.614-.614.75.75 0 00-.406 1.44l.9.3a.75.75 0 01.5.85 .75.75 0 00.614.614.75.75 0 00.406-1.44l-.3-.9zM3.597 7.598a.75.75 0 00-1.44.406l.9.3a.75.75 0 01.5.85.75.75 0 00.614.614.75.75 0 00.406-1.44l-.3-.9a.75.75 0 01-.5-.85.75.75 0 00-.614-.614.75.75 0 00-.406 1.44l.9.3z" clipRule="evenodd" />
									</svg>
									Xác thực
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 p-4 space-y-3">
							<div>
								<h3 className="text-lg font-semibold text-slate-900">{kol.name}</h3>
								<p className="text-xs text-slate-500 uppercase tracking-[0.05em]">{kol.category}</p>
							</div>

							<p className="text-sm text-slate-600 line-clamp-2">{kol.bio}</p>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-2 text-xs">
								<div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
									<span className="text-slate-500">👥</span>
									<span className="font-semibold text-slate-900">{(kol.followers / 1000).toFixed(0)}k</span>
									<span className="text-slate-500">followers</span>
								</div>
								<div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
									<span className="text-amber-500">⭐</span>
									<span className="font-semibold text-slate-900">{kol.rating.toFixed(1)}</span>
									<span className="text-slate-500">({kol.reviewCount})</span>
								</div>
							</div>

							{/* Price */}
							<div className="pt-2 border-t border-slate-200">
								<p className="text-xs text-slate-500 mb-1">Giá review:</p>
								<p className="text-lg font-bold text-indigo-600">
									{kol.pricePerReview.toLocaleString('vi-VN')} VNĐ
								</p>
							</div>

							{/* Button */}
							<button
								onClick={() => {
									setSelectedKol(kol);
									setShowBookingForm(true);
								}}
								className="w-full mt-3 rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition"
							>
								Đặt review
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Booking Modal */}
			{showBookingForm && selectedKol && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
							<h3 className="text-xl font-bold text-slate-900">Đặt KOL Review</h3>
							<button
								onClick={() => setShowBookingForm(false)}
								className="text-slate-500 hover:text-slate-700"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleBooking} className="p-6 space-y-4">
							<div className="bg-slate-50 p-4 rounded-lg mb-4">
								<p className="text-sm font-semibold text-slate-900">{selectedKol.name}</p>
								<p className="text-xs text-slate-600">{selectedKol.category}</p>
								<p className="text-sm font-bold text-indigo-600 mt-2">
									{selectedKol.pricePerReview.toLocaleString('vi-VN')} VNĐ
								</p>
							</div>

							{message && (
								<div className={`p-3 rounded-lg text-sm font-medium ${
									message.startsWith('✓') 
										? 'bg-green-50 text-green-700 border border-green-200' 
										: 'bg-red-50 text-red-700 border border-red-200'
								}`}>
									{message}
								</div>
							)}

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Tên của bạn *
								</label>
								<input
									type="text"
									required
									value={bookingForm.userName}
									onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="Nhập tên"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Email *
								</label>
								<input
									type="email"
									required
									value={bookingForm.userEmail}
									onChange={(e) => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="example@email.com"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Số điện thoại *
								</label>
								<input
									type="tel"
									required
									value={bookingForm.userPhone}
									onChange={(e) => setBookingForm({ ...bookingForm, userPhone: e.target.value })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="0123456789"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Loại review *
								</label>
								<select
									value={bookingForm.reviewType}
								onChange={(e) => setBookingForm({ ...bookingForm, reviewType: e.target.value as 'photo' | 'video' | 'story' | 'mixed' })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
								>
									<option value="photo">Ảnh</option>
									<option value="video">Video</option>
									<option value="story">Story</option>
									<option value="mixed">Kết hợp</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Ghi chú thêm
								</label>
								<textarea
									value={bookingForm.notes}
									onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="Nêu yêu cầu hoặc ghi chú đặc biệt..."
									rows={3}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-900 mb-1">
									Ngân sách (VNĐ) *
								</label>
								<input
									type="number"
									required
									min="0"
									value={bookingForm.budget}
									onChange={(e) => setBookingForm({ ...bookingForm, budget: Number(e.target.value) })}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder={String(selectedKol.pricePerReview)}
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setShowBookingForm(false)}
									className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition"
								>
									Hủy
								</button>
								<button
									type="submit"
									disabled={loading}
									className="flex-1 rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Đang xử lý...' : 'Xác nhận đặt'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
