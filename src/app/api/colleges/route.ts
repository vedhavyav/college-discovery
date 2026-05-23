import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const domain = searchParams.get('domain') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxFees = parseFloat(searchParams.get('maxFees') || '0');
    const sortBy = searchParams.get('sortBy') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (state) {
      where.state = state;
    }

    if (type) {
      where.type = type;
    }

    if (domain) {
      where.domain = domain;
    }

    if (minRating > 0) {
      where.rating = {
        gte: minRating,
      };
    }

    if (maxFees > 0) {
      where.fees = {
        lte: maxFees,
      };
    }

    let orderBy: any = {};
    if (sortBy === 'fees_asc') {
      orderBy = { fees: 'asc' };
    } else if (sortBy === 'fees_desc') {
      orderBy = { fees: 'desc' };
    } else if (sortBy === 'rating_desc') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'placement_desc') {
      orderBy = { placementMedian: 'desc' };
    } else {
      orderBy = { ranking: 'asc' };
    }

        const [colleges, totalCount, allStates] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: {
            take: 3,
          },
        },
      }),
      prisma.college.count({ where }),
      prisma.college.findMany({
        select: { state: true },
        distinct: ['state'],
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const states = allStates.map((s) => s.state).sort();

    return NextResponse.json({
      colleges,
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      states,
    });
  } catch (error: any) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
 