export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 p-4 text-base-content">
      <p>&copy; 2026 NotesHub.Mini Project</p>
      <p className="text-xs text-gray-600">
        Book data and covers provided by{' '}
        <a href="https://openlibrary.org/" target="_blank" rel="noreferrer" className="link link-primary">
          Open Library
        </a>
      </p>
    </footer>
  )
}