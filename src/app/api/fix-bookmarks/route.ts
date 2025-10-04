import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting bookmark migration...');
    
    // Get all users with bookmarks
    const bookmarksRef = adminDb.ref('bookmarks');
    const snapshot = await bookmarksRef.once('value');
    
    if (!snapshot.exists()) {
      return NextResponse.json({ 
        success: true, 
        message: 'No bookmarks found to migrate' 
      });
    }

    const bookmarksData = snapshot.val();
    let migratedCount = 0;
    let errorCount = 0;

    for (const [userId, userBookmarks] of Object.entries(bookmarksData as any)) {
      console.log(`📚 Processing bookmarks for user: ${userId}`);
      
      for (const [bookmarkId, bookmarkData] of Object.entries(userBookmarks as any)) {
        try {
          // Check if this bookmark has an invalid key (contains special characters)
          if (bookmarkId.includes('=') || bookmarkId.includes('?') || bookmarkId.includes('.') || 
              bookmarkId.includes('#') || bookmarkId.includes('$') || bookmarkId.includes('[') || 
              bookmarkId.includes(']') || bookmarkId.includes('/')) {
            
            console.log(`🔄 Migrating bookmark with invalid key: ${bookmarkId}`);
            
            // Create safe key
            const safeKey = encodeFirebaseKey(bookmarkId);
            
            // Create new bookmark with safe key
            const newBookmarkRef = adminDb.ref(`bookmarks/${userId}/${safeKey}`);
            await newBookmarkRef.set(bookmarkData);
            
            // Remove old bookmark
            const oldBookmarkRef = adminDb.ref(`bookmarks/${userId}/${bookmarkId}`);
            await oldBookmarkRef.remove();
            
            migratedCount++;
            console.log(`✅ Migrated bookmark: ${bookmarkId} -> ${safeKey}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating bookmark ${bookmarkId}:`, error);
          errorCount++;
        }
      }
    }

    console.log(`🎉 Migration complete! Migrated: ${migratedCount}, Errors: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: `Migration complete! Migrated ${migratedCount} bookmarks with ${errorCount} errors.`,
      migratedCount,
      errorCount
    });

  } catch (error) {
    console.error('❌ Bookmark migration failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function encodeFirebaseKey(key: string): string {
  return key
    .replace(/\./g, '%2E')
    .replace(/#/g, '%23')
    .replace(/\$/g, '%24')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D')
    .replace(/=/g, '%3D')
    .replace(/\?/g, '%3F')
    .replace(/\//g, '%2F');
}

export async function GET() {
  return NextResponse.json({
    message: 'Bookmark migration endpoint. Use POST to run migration.',
    usage: 'POST /api/fix-bookmarks'
  });
}