'use client'

import Link from 'next/link'
import BeritaCard from './CardBerita'
import HeaderPage from './HeaderPage'
import { useLatestBerita } from '@/hooks/useBerita'
import { Loader2 } from 'lucide-react'

export default function Berita() {
	const { berita, loading, error } = useLatestBerita(3)

	if (loading) {
		return (
			<section className='px-4 sm:px-6 lg:px-8'>
				<div className='container mx-auto max-w-7xl'>
					<HeaderPage title='Berita Terbaru' description='Informasi terkini seputar Kelurahan Bilokka' />
					<div className='flex justify-center items-center py-12'>
						<Loader2 className='animate-spin h-8 w-8 text-blue-600' />
						<span className='ml-2 text-gray-600'>Memuat berita...</span>
					</div>
				</div>
			</section>
		)
	}

	if (error) {
		return (
			<section className='px-4 sm:px-6 lg:px-8'>
				<div className='container mx-auto max-w-7xl'>
					<HeaderPage title='Berita Terbaru' description='Informasi terkini seputar Kelurahan Bilokka' />
					<div className='text-center py-12'>
						<p className='text-red-600 mb-4'>Gagal memuat berita: {error}</p>
						<button 
							onClick={() => window.location.reload()}
							className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
						>
							Coba Lagi
						</button>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className='px-4 sm:px-6 lg:px-8 mb-4'>
			<div className='container mx-auto max-w-7xl'>
				<HeaderPage title='Berita Terbaru' description='Informasi terkini seputar Kelurahan Bilokka' />
				
				{berita.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-gray-600 mb-4'>Belum ada berita yang dipublikasikan.</p>
						<Link 
							href='/berita'
							className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
						>
							Lihat Semua Berita
						</Link>
					</div>
				) : (
					<>
						<div className='flex flex-col items-center space-y-6 md:grid md:grid-cols-2 md:space-y-0 md:gap-6 lg:grid-cols-3'>
							{berita.map(item => (
								<BeritaCard key={item.id} berita={item} />
							))}
						</div>
						
						<div className='text-center mt-8'>
							<Link
								href='/berita'
								className='inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors'
							>
								Lihat Semua Berita
							</Link>
						</div>
					</>
				)}
			</div>
		</section>
	)
}
