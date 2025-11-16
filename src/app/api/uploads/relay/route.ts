import { NextResponse } from 'next/server'

export async function POST() {
	return NextResponse.json(
		{ error: 'Upload relay is disabled in this deployment. Use direct uploads instead.' },
		{ status: 501 },
	)
}
