// app/api/tours/route.ts
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

// GET - Obtener todos los tours
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection();
    const tours = await collection.find({}).toArray();
    
    return NextResponse.json(tours, { status: 200 });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await getCollection();
    
    const newTour = {
      tourName: body.tourName,
      year: body.year || new Date().getFullYear(),
      month: body.month,
      arrivalDate: body.arrivalDate || 1,
      departureDate: body.departureDate || 1,
      airport: body.airport || {
        name: '',
        code: '',
        transfersIncluded: 'Todos'
      },
      days: body.days || [],
      compania: body.compania || [],
      destino: body.destino || [],
      especial: body.especial || [],
      plan: body.plan || []
    };

    const result = await collection.insertOne(newTour);
    const createdTour = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json(createdTour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}