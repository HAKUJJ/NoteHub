export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer footer-center container mx-auto max-w-7xl px-4 py-4">
        <p>&copy; 2026 NotesHub.Mini Project</p>
        <p className="text-xs text-gray-600">
          Book data and covers provided by{' '}
          <a href="https://openlibrary.org/" target="_blank" rel="noreferrer" className="link link-primary">
            Open Library
          </a>
        </p>
      </div>
    </footer>
  )
}