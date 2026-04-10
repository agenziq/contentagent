import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { readLibrary, writeLibrary } from '@/lib/storage';
import { LibraryItem } from '@/lib/types';

export async function GET() {
  const items = await readLibrary();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Omit<LibraryItem, 'id' | 'createdAt'>;
    const items = await readLibrary();

    const newItem: LibraryItem = {
      ...payload,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    await writeLibrary(items);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save item.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = (await request.json()) as { id: string };
    const items = await readLibrary();

    const updated = items.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );

    await writeLibrary(updated);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update favorite.' }, { status: 500 });
  }
}
