import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Libro {
    id: number;
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

    // =========================================================
    // LIBROS
    // =========================================================

    libros = signal<Libro[]>([
        {
            id: 1,
            titulo: 'Cien años de soledad',
            autor: 'Gabriel García Márquez',
            isbn: '9780307474728',
            categoria: 'Novela',
            editorial: 'Diana',
            anio: 1967,
            calificacion: 4.9,
            disponible: 5,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780307474728-L.jpg',
            descripcion:
                'Una de las novelas más importantes de la literatura latinoamericana.',
            favorito: true,
        },
        {
            id: 2,
            titulo: 'El principito',
            autor: 'Antoine de Saint-Exupéry',
            isbn: '9780156012195',
            categoria: 'Fantasía',
            editorial: 'Harcourt',
            anio: 1943,
            calificacion: 4.8,
            disponible: 8,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
            descripcion:
                'Un clásico que reflexiona sobre la amistad, el amor y la vida.',
            favorito: true,
        },
        {
            id: 3,
            titulo: 'Don Quijote de la Mancha',
            autor: 'Miguel de Cervantes',
            isbn: '9780060934347',
            categoria: 'Clásico',
            editorial: 'Harper Perennial',
            anio: 1605,
            calificacion: 4.7,
            disponible: 3,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
            descripcion:
                'La historia del ingenioso hidalgo Don Quijote y sus aventuras.',
            favorito: false,
        },
        {
            id: 4,
            titulo: 'Harry Potter y la piedra filosofal',
            autor: 'J. K. Rowling',
            isbn: '9780590353427',
            categoria: 'Fantasía',
            editorial: 'Scholastic',
            anio: 1997,
            calificacion: 4.9,
            disponible: 10,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
            descripcion:
                'El inicio de las aventuras de Harry Potter en Hogwarts.',
            favorito: true,
        },
        {
            id: 5,
            titulo: '1984',
            autor: 'George Orwell',
            isbn: '9780451524935',
            categoria: 'Ciencia ficción',
            editorial: 'Signet Classic',
            anio: 1949,
            calificacion: 4.6,
            disponible: 4,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
            descripcion:
                'Una novela distópica sobre una sociedad sometida a vigilancia.',
            favorito: false,
        },
        {
            id: 6,
            titulo: 'Orgullo y prejuicio',
            autor: 'Jane Austen',
            isbn: '9780141439518',
            categoria: 'Romance',
            editorial: 'Penguin Classics',
            anio: 1813,
            calificacion: 4.8,
            disponible: 6,
            portada:
                'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
            descripcion:
                'Una historia clásica sobre amor, sociedad y prejuicios.',
            favorito: false,
        },
    ]);


    // =========================================================
    // BUSCADOR
    // =========================================================

    busqueda = signal('');

    categoriaSeleccionada = signal('Todas');

    categorias = computed(() => {

        const lista = this.libros().map(
            (libro) => libro.categoria
        );

        return ['Todas', ...new Set(lista)];

    });


    // =========================================================
    // LIBROS FILTRADOS
    // =========================================================

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


    // =========================================================
    // ESTADÍSTICAS
    // =========================================================

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


    // =========================================================
    // TOP 10
    // =========================================================

    top10Libros = computed(() =>
        [...this.libros()]
            .sort(
                (a, b) =>
                    b.calificacion - a.calificacion
            )
            .slice(0, 10)
    );


    // =========================================================
    // RECIENTES
    // =========================================================

    librosRecientes = computed(() =>
        [...this.libros()]
            .reverse()
            .slice(0, 6)
    );


    // =========================================================
    // SUGERIDOS
    // =========================================================

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


    // =========================================================
    // FORMULARIO
    // =========================================================

    mostrandoFormulario = signal(false);

    modoEdicion = signal(false);

    libroEditandoId = signal<number | null>(null);

    libroForm = signal<LibroFormulario>(
        this.formularioVacio()
    );


    // =========================================================
    // MENSAJES
    // =========================================================

    mensaje = signal('');

    tipoMensaje =
        signal<'success' | 'error'>('success');


    // =========================================================
    // FORMULARIO VACÍO
    // =========================================================

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


    // =========================================================
    // NUEVO LIBRO
    // =========================================================

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


    // =========================================================
    // EDITAR
    // =========================================================

    editarLibro(libro: Libro): void {

        this.modoEdicion.set(true);

        this.libroEditandoId.set(
            libro.id
        );

        this.libroForm.set({

            titulo: libro.titulo,

            autor: libro.autor,

            isbn: libro.isbn,

            categoria: libro.categoria,

            editorial: libro.editorial,

            anio: libro.anio,

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


    // =========================================================
    // GUARDAR
    // =========================================================

    guardarLibro(): void {

        const formulario =
            this.libroForm();


        // VALIDAR TÍTULO

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


        // VALIDAR AUTOR

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


        // VALIDAR CATEGORÍA

        if (!formulario.categoria.trim()) {

            this.mostrarMensaje(
                'La categoría es obligatoria.',
                'error'
            );

            return;
        }


        // VALIDAR CALIFICACIÓN

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


        // VALIDAR DISPONIBLES

        if (
            formulario.disponible < 0
        ) {

            this.mostrarMensaje(
                'La cantidad disponible no puede ser negativa.',
                'error'
            );

            return;
        }


        // =====================================================
        // EDITAR
        // =====================================================

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

        }


        // =====================================================
        // AGREGAR
        // =====================================================

        else {

            const nuevoId =
                this.libros().length > 0
                    ? Math.max(
                          ...this.libros()
                              .map(
                                  (libro) =>
                                      libro.id
                              )
                      ) + 1
                    : 1;


            const nuevoLibro: Libro = {

                id: nuevoId,

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

                favorito: false,

            };


            this.libros.update(
                (libros) => [
                    ...libros,
                    nuevoLibro,
                ]
            );


            this.mostrarMensaje(
                'El libro se agregó correctamente.',
                'success'
            );

        }


        this.cancelarFormulario();

    }


    // =========================================================
    // CANCELAR
    // =========================================================

    cancelarFormulario(): void {

        this.mostrandoFormulario.set(false);

        this.modoEdicion.set(false);

        this.libroEditandoId.set(null);

        this.libroForm.set(
            this.formularioVacio()
        );

    }


    // =========================================================
    // ELIMINAR
    // =========================================================

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


    // =========================================================
    // FAVORITOS
    // =========================================================

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
                : 'Libro agregado a favoritos.',
            'success'
        );

    }


    // =========================================================
    // BÚSQUEDA
    // =========================================================

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


    // =========================================================
    // ACTUALIZAR CAMPOS
    // =========================================================

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


    // =========================================================
    // CONVERTIR NÚMEROS
    // =========================================================

    convertirNumero(
        valor: string | number
    ): number {

        const numero = Number(valor);

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

        const numero = Number(valor);

        return Number.isNaN(numero)
            ? null
            : numero;

    }


    // =========================================================
    // MENSAJES
    // =========================================================

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