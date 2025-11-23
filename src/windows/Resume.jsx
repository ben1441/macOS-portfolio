import WindowWrapper from "#hoc/WindowWrapper";
import { WindowControls } from "#components";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Document, Page } from "react-pdf";
import { useState } from "react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Resume = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <a href="files/resume.pdf" download className="cursor-pointer" title="Download resume">
                    <Download className="icon" />
                </a>
            </div>

            <Document file="files/resume.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>

            {/* Navigator */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-500/20 backdrop-blur-md rounded-full px-4 py-2 z-50">
                <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium">{pageNumber} of {numPages}</span>

                <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </>
    )
}

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;