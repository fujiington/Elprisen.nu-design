import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const day = searchParams.get('day');
  const region = searchParams.get('region') ?? 'DK2';

  if (!year || !month || !day) {
    return NextResponse.json({ error: 'Manglende parametre: year, month, day' }, { status: 400 });
  }

  // Validate region to prevent injection
  if (region !== 'DK1' && region !== 'DK2') {
    return NextResponse.json({ error: 'Ugyldig region' }, { status: 400 });
  }

  // Validate numeric values
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) {
    return NextResponse.json({ error: 'Ugyldige datoparametre' }, { status: 400 });
  }

  const upstream = `https://www.elprisenligenu.dk/api/v1/prices/${year}/${month}-${day}_${region}.json`;

  try {
    const res = await fetch(upstream, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Elpriserne er ikke tilgængelige for denne dato' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Netværksfejl ved hentning af elpriser' }, { status: 502 });
  }
}
