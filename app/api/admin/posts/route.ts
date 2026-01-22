import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: 取得所有文章
export async function GET() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts });
}

// POST: 新增文章
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 驗證使用者
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, excerpt, content, category, spotify_track_id, cover_image, published } = body;

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title,
      excerpt,
      content,
      category,
      spotify_track_id,
      cover_image,
      published: published ?? false,
      author_id: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}

// PATCH: 更新文章（發布/取消發布）
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // 驗證使用者
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post });
}

// DELETE: 刪除文章
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // 驗證使用者
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Post deleted' });
}
