import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    Book,
    BooksService,
} from '../../core/books/books.service';

interface Libro {
    id: string;
    titulo: string;
    autor: string;
    isbn: string;
    categoria: string;
    editorial: string;
    anio: number | null;
    calificacion: number;
    disponible: number;
    portada: string;
    descripcion: string;
    favorito: boolean;
}

interface LibroFormulario {
    titulo: string;
    autor: string;
    isbn: string;
    categoria: string;
    editorial: string;
    anio: number | null;
    calificacion: number;
    disponible: number;
    portada: string;
    descripcion: string;
}

@Component({
    selector: 'app-administracion-libros',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './administracion-libros.html',
})
export class AdministracionLibrosComponent {

    private booksService = inject(BooksService);

    cargando = signal(false);

    libros = signal<Libro[]>([]);

    busqueda = signal('');

    categoriaSeleccionada = signal('Todas');

    categorias = computed(() => {
        const lista = this.libros().map(
            (libro) => libro.categoria
        );

        return ['Todas', ...new Set(lista)];
    });

    librosFiltrados = computed(() => {

        const texto = this.busqueda()
            .trim()
            .toLowerCase();

        const categoria = this.categoriaSeleccionada();

        return this.libros().filter((libro) => {

            const titulo = libro.titulo
                .toLowerCase()
                .includes(texto);

            const autor = libro.autor
                .toLowerCase()
                .includes(texto);

            const isbn = libro.isbn
                .toLowerCase()
                .includes(texto);

            const editorial = libro.editorial
                .toLowerCase()
                .includes(texto);

            const categoriaLibro = libro.categoria
                .toLowerCase()
                .includes(texto);

            const coincideTexto =
                texto === '' ||
                titulo ||
                autor ||
                isbn ||
                editorial ||
                categoriaLibro;

            const coincideCategoria =
                categoria === 'Todas' ||
                libro.categoria === categoria;

            return coincideTexto && coincideCategoria;
        });
    });

    totalLibros = computed(() =>
        this.libros().length
    );

    librosDisponibles = computed(() =>
        this.libros().filter(
            (libro) => libro.disponible > 0
        ).length
    );

    librosFavoritos = computed(() =>
        this.libros().filter(
            (libro) => libro.favorito
        ).length
    );

    top10Libros = computed(() =>
        [...this.libros()]
            .sort(
                (a, b) =>
                    b.calificacion - a.calificacion
            )
            .slice(0, 10)
    );

    librosRecientes = computed(() =>
        [...this.libros()]
            .reverse()
            .slice(0, 6)
    );

    librosSugeridos = computed(() =>
        [...this.libros()]
            .filter(
                (libro) =>
                    libro.calificacion >= 4.7
            )
            .sort(
                (a, b) =>
                    b.calificacion - a.calificacion
            )
            .slice(0, 6)
    );

    mostrandoFormulario = signal(false);

    modoEdicion = signal(false);

    libroEditandoId = signal<string | null>(null);

    libroForm = signal<LibroFormulario>(
        this.formularioVacio()
    );

    mensaje = signal('');

    tipoMensaje =
        signal<'success' | 'error'>('success');

    constructor() {
        this.cargarLibros();
    }

    private cargarLibros(): void {

        this.cargando.set(true);

        this.booksService.getBooks(1, 100).subscribe({

            next: (response) => {

                const librosConvertidos: Libro[] =
                    response.data.map((book) =>
                        this.convertirLibro(book)
                    );

                this.libros.set(
                    librosConvertidos
                );

                this.cargando.set(false);

                console.log(
                    'Libros recibidos del backend:',
                    response
                );
            },

            error: (error) => {

                this.cargando.set(false);

                console.error(
                    'Error al cargar libros:',
                    error
                );

                this.mostrarMensaje(
                    'No se pudieron cargar los libros.',
                    'error'
                );
            },
        });
    }

    private convertirLibro(
        book: Book
    ): Libro {

        return {

            id:
                book.id,

            titulo:
                book.title ?? '',

            autor:
                book.author ?? '',

            isbn:
                '',

            categoria:
                book.categoryId ?? '',

            editorial:
                '',

            anio:
                null,

            calificacion:
                0,

            disponible:
                1,

            portada:
                book.fileUrl ?? '',

            descripcion:
                '',

            favorito:
                false,
        };
    }

    private formularioVacio(): LibroFormulario {

        return {

            titulo: '',
            autor: '',
            isbn: '',
            categoria: '',
            editorial: '',
            anio: null,
            calificacion: 0,
            disponible: 0,
            portada: '',
            descripcion: '',
        };
    }

    nuevoLibro(): void {

        this.modoEdicion.set(false);

        this.libroEditandoId.set(null);

        this.libroForm.set(
            this.formularioVacio()
        );

        this.mostrandoFormulario.set(true);

        this.limpiarMensaje();

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    editarLibro(
        libro: Libro
    ): void {

        this.modoEdicion.set(true);

        this.libroEditandoId.set(
            libro.id
        );

        this.libroForm.set({

            titulo:
                libro.titulo,

            autor:
                libro.autor,

            isbn:
                libro.isbn,

            categoria:
                libro.categoria,

            editorial:
                libro.editorial,

            anio:
                libro.anio,

            calificacion:
                libro.calificacion,

            disponible:
                libro.disponible,

            portada:
                libro.portada,

            descripcion:
                libro.descripcion,
        });

        this.mostrandoFormulario.set(true);

        this.limpiarMensaje();

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    guardarLibro(): void {

        const formulario =
            this.libroForm();

        if (!formulario.titulo.trim()) {

            this.mostrarMensaje(
                'El título del libro es obligatorio.',
                'error'
            );

            return;
        }

        if (
            formulario.titulo
                .trim()
                .length < 2
        ) {

            this.mostrarMensaje(
                'El título debe tener al menos 2 caracteres.',
                'error'
            );

            return;
        }

        if (!formulario.autor.trim()) {

            this.mostrarMensaje(
                'El autor del libro es obligatorio.',
                'error'
            );

            return;
        }

        if (
            formulario.autor
                .trim()
                .length < 2
        ) {

            this.mostrarMensaje(
                'El autor debe tener al menos 2 caracteres.',
                'error'
            );

            return;
        }

        if (!formulario.categoria.trim()) {

            this.mostrarMensaje(
                'La categoría es obligatoria.',
                'error'
            );

            return;
        }

        if (
            formulario.calificacion < 0 ||
            formulario.calificacion > 5
        ) {

            this.mostrarMensaje(
                'La calificación debe estar entre 0 y 5.',
                'error'
            );

            return;
        }

        if (
            formulario.disponible < 0
        ) {

            this.mostrarMensaje(
                'La cantidad disponible no puede ser negativa.',
                'error'
            );

            return;
        }

        if (this.modoEdicion()) {

            const id =
                this.libroEditandoId();

            this.libros.update(
                (libros) =>
                    libros.map(
                        (libro) =>
                            libro.id === id
                                ? {
                                    ...libro,

                                    titulo:
                                        formulario.titulo.trim(),

                                    autor:
                                        formulario.autor.trim(),

                                    isbn:
                                        formulario.isbn.trim(),

                                    categoria:
                                        formulario.categoria.trim(),

                                    editorial:
                                        formulario.editorial.trim(),

                                    anio:
                                        formulario.anio,

                                    calificacion:
                                        Number(
                                            formulario.calificacion
                                        ),

                                    disponible:
                                        Number(
                                            formulario.disponible
                                        ),

                                    portada:
                                        formulario.portada.trim(),

                                    descripcion:
                                        formulario.descripcion.trim(),
                                }
                                : libro
                    )
            );

            this.mostrarMensaje(
                'El libro se actualizó correctamente.',
                'success'
            );

            this.cancelarFormulario();

            return;
        }

        const nuevoLibro = {
            title:
                formulario.titulo.trim(),

            author:
                formulario.autor.trim(),

            categoryId:
                null,

            fileUrl:
                formulario.portada.trim() || null,
        };

        this.cargando.set(true);

        this.booksService.createBook(nuevoLibro).subscribe({

            next: (book) => {

                const libroConvertido =
                    this.convertirLibro(book);

                this.libros.update(
                    (libros) => [
                        ...libros,
                        libroConvertido,
                    ]
                );

                this.cargando.set(false);

                this.mostrarMensaje(
                    'El libro se agregó correctamente.',
                    'success'
                );

                this.cancelarFormulario();
            },

            error: (error) => {

                this.cargando.set(false);

                console.error(
                    'Error al crear el libro:',
                    error
                );

                this.mostrarMensaje(
                    'No se pudo guardar el libro en la base de datos.',
                    'error'
                );
            },
        });
    }

    cancelarFormulario(): void {

        this.mostrandoFormulario.set(false);

        this.modoEdicion.set(false);

        this.libroEditandoId.set(null);

        this.libroForm.set(
            this.formularioVacio()
        );
    }

    eliminarLibro(
        libro: Libro
    ): void {

        const confirmar =
            window.confirm(
                `¿Estás seguro de eliminar "${libro.titulo}"?`
            );

        if (!confirmar) {
            return;
        }

        this.libros.update(
            (libros) =>
                libros.filter(
                    (item) =>
                        item.id !== libro.id
                )
        );

        this.mostrarMensaje(
            'El libro se eliminó correctamente.',
            'success'
        );
    }

    cambiarFavorito(
        libro: Libro
    ): void {

        this.libros.update(
            (libros) =>
                libros.map(
                    (item) =>
                        item.id === libro.id
                            ? {
                                ...item,

                                favorito:
                                    !item.favorito,
                            }
                            : item
                )
        );

        this.mostrarMensaje(
            libro.favorito
                ? 'Libro eliminado de favoritos.'
                : 'Libro agregado de favoritos.',
            'success'
        );
    }

    actualizarBusqueda(
        valor: string
    ): void {

        this.busqueda.set(valor);
    }

    actualizarCategoria(
        valor: string
    ): void {

        this.categoriaSeleccionada.set(
            valor
        );
    }

    limpiarFiltros(): void {

        this.busqueda.set('');

        this.categoriaSeleccionada.set(
            'Todas'
        );
    }

    actualizarCampo(
        campo: keyof LibroFormulario,
        valor: string | number | null
    ): void {

        this.libroForm.update(
            (formulario) => ({
                ...formulario,
                [campo]: valor,
            })
        );
    }

    convertirNumero(
        valor: string | number
    ): number {

        const numero =
            Number(valor);

        return Number.isNaN(numero)
            ? 0
            : numero;
    }

    convertirNumeroONull(
        valor: string | number | null
    ): number | null {

        if (
            valor === '' ||
            valor === null
        ) {
            return null;
        }

        const numero =
            Number(valor);

        return Number.isNaN(numero)
            ? null
            : numero;
    }

    private mostrarMensaje(
        texto: string,
        tipo: 'success' | 'error'
    ): void {

        this.mensaje.set(texto);

        this.tipoMensaje.set(tipo);

        setTimeout(() => {

            this.mensaje.set('');

        }, 4000);
    }

    private limpiarMensaje(): void {

        this.mensaje.set('');
    }
}