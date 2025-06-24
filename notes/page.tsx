import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Tag } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  excerpt: string | null
  tags: string[]
  created_at: string
  category: {
    id: string
    name: string
  } | null
}

interface Category {
  id: string
  name: string
  description: string | null
}

async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select(`
      *,
      category:categories(id, name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notes:", error)
    return []
  }

  return data || []
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export default async function NotesPage() {
  const [notes, categories] = await Promise.all([getNotes(), getCategories()])

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Learning Notes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My collection of insights, tutorials, and learnings from the world of AI, machine learning, and data
            science.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search notes..." className="pl-10 bg-white" />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && <CardDescription>{category.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      {notes.filter((note) => note.category?.id === category.id).length} notes
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No notes found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NoteCard({ note }: { note: Note }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
              {note.title}
            </CardTitle>
            {note.category && (
              <Badge variant="secondary" className="mt-2">
                {note.category.name}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-gray-600 mt-3 line-clamp-3">
          {note.excerpt || note.content.substring(0, 150) + "..."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(note.created_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
