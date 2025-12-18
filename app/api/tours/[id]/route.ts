// app/api/tours/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = 'mongodb+srv://fatima2345612_db_user:je4zWh1njoBspLU1@cluster0.whutp0a.mongodb.net/project0';
const DB_NAME = 'project0';
const COLLECTION_NAME = 'tours';

let client: MongoClient | null = null;

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

async function getCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// PUT - Actualizar un tour
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const collection = await getCollection();
    
    const { _id, ...updateData } = body;
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.value, { status: 200 });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await getCollection();
    
    const result = await collection.deleteOne({
      _id: new ObjectId(params.id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Tour deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
}