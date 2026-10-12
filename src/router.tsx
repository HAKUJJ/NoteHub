import { createBrowserRouter } from 'react-router'
import RootLayout from './components/layout/RootLayout'
import SidebarLayout from './components/layout/SidebarLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import CoursesPage from './pages/CoursesPage'
import CreatePostPage from './pages/CreatePostPage'
import MatcherPage from './pages/MatcherPage'
import PostPage from './pages/PostPage'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import FieldPage from './pages/FieldPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: SidebarLayout,
        children: [
          { index: true, Component: HomePage },
          { path: 'courses', Component: CoursesPage },
        ],
      },
      { path: 'about', Component: AboutPage },
      { path: 'create-post', Component: CreatePostPage },
      { path: 'matcher', Component: MatcherPage },
      { path: 'post/:id', Component: PostPage },
      { path: 'books', Component: BooksPage },
      { path: 'books/:id', Component: BookDetailPage },
      { path: 'favorites', Component: FavoritesPage },
      { path: 'fields/:id', Component: FieldPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
  { path: 'admin', Component: AdminPage },
])
