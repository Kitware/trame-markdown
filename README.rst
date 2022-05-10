Markdown renderer for trame
===========================================================================

trame-markdown extend trame **widgets** with a component that is capable of rendering Markdown syntax.
Markdown integration into trame allow user to display markdown content easily. If you want are wondering what Markdown is, you can look at `some online guides <https://www.markdownguide.org/basic-syntax/>`_.


Installing
-----------------------------------------------------------

trame-markdown can be installed with `pip <https://pypi.org/project/trame-markdown/>`_:

.. code-block:: bash

    pip install --upgrade trame-markdown


Usage
-----------------------------------------------------------

The `Trame Tutorial <https://kitware.github.io/trame/docs/tutorial.html>`_ is the place to go to learn how to use the library and start building your own application.

The `API Reference <https://trame.readthedocs.io/en/latest/index.html>`_ documentation provides API-level documentation.


License
-----------------------------------------------------------

trame-markdown is made available under the MIT License. For more details, see `LICENSE <https://github.com/Kitware/trame-markdown/blob/master/LICENSE>`_
This license has been chosen to match the one use by `Markdown It Vue <https://github.com/ravenq/markdown-it-vue/blob/master/LICENSE>`_ which is used under the cover.


Community
-----------------------------------------------------------

`Trame <https://kitware.github.io/trame/>`_ | `Discussions <https://github.com/Kitware/trame/discussions>`_ | `Issues <https://github.com/Kitware/trame/issues>`_ | `RoadMap <https://github.com/Kitware/trame/projects/1>`_ | `Contact Us <https://www.kitware.com/contact-us/>`_

.. image:: https://zenodo.org/badge/410108340.svg
    :target: https://zenodo.org/badge/latestdoi/410108340


Enjoying trame?
-----------------------------------------------------------

Share your experience `with a testimonial <https://github.com/Kitware/trame/issues/18>`_ or `with a brand approval <https://github.com/Kitware/trame/issues/19>`_.


Code sample
-----------------------------------------------------------

.. code-block:: python

    from trame.widgets import markdown

    widget = markdown.Markdown("""
    > #### The quarterly results look great!
    >
    > - Revenue was off the chart.
    > - Profits were higher than ever.
    >
    >  *Everything* is going according to **plan**.
    """)
    widget.update(md_file.read())

But if you rather be in control of your variable, you can use the property `content`.

.. code-block:: python

    from trame.widgets import markdown

    widget = markdown.Markdown(content=("var_name", "**hello**"))


Development
-----------------------------------------------------------

To update client side, just update the version and run the following commands.

.. code-block:: bash

    mkdir -p trame_markdown/module/serve
    cd trame_markdown/module/serve
    curl -L https://registry.npmjs.org/markdown-it-vue/-/markdown-it-vue-1.1.7.tgz | tar --strip-components=1 -xzv
