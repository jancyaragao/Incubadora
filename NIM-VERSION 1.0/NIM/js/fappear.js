/*
 * jQuery.fappear
 * https://github.com/bas2k/jquery.fappear/
 * http://code.google.com/p/jquery-fappear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function ($) {
    $.fn.fappear = function (fn, options) {

        var settings = $.extend({

            //dados arbitrários para passar para fn
            data: undefined,

            //chama fn somente no primeiro fappear?
            one: true,

            // Precisão X & Y
            accX: 0,
            accY: 0

        }, options);

        return this.each(function () {

            var t = $(this);

            //se o elemento está atualmente visível
            t.fappeared = false;

            if (!fn) {

                //acionar o evento personalizado
                t.trigger('fappear', settings.data);
                return;
            }

            var w = $(window);

            //aciona o evento fappear quando apropriado
            var check = function () {

                //o elemento está oculto?
                if (!t.is(':visible')) {

                    //ficou oculto
                    t.fappeared = false;
                    return;
                }

                //É o elemento dentro da janela visível?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                    y <= b + wh + ay &&
                    x + tw + ax >= a &&
                    x <= a + ww + ax) {

                    //Acionar o evento personalizado
                    if (!t.fappeared) t.trigger('fappear', settings.data);

                } else {

                    //Deslocou-se para fora da vista
                    t.fappeared = false;
                }
            };

            //Criar um fn modificado com alguma lógica adicional
            var modifiedFn = function () {

                //Marcar o elemento como visível
                t.fappeared = true;

                //Isso é pode acontecer apenas uma vez?
                if (settings.one) {

                    //Remover a verificação
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.fappear.checks);
                    if (i >= 0) $.fn.fappear.checks.splice(i, 1);
                }

                //Acionar o fn original
                fn.apply(this, arguments);
            };

            //Ligam o fn modificado ao elemento
            if (settings.one) t.one('fappear', settings.data, modifiedFn);
            else t.bind('fappear', settings.data, modifiedFn);

            //Verificar sempre que a janela rolar
            w.scroll(check);

            //Verificar sempre que o dom muda
            $.fn.fappear.checks.push(check);

            //Verificar agora
            (check)();
        });
    };

    //Manter uma fila de verificações de falhas
    $.extend($.fn.fappear, {

        checks: [],
        timeout: null,

        //Processar a fila
        checkAll: function () {
            var length = $.fn.fappear.checks.length;
            if (length > 0) while (length--) ($.fn.fappear.checks[length])();
        },

        // Verificar a fila de forma assíncrona
        run: function () {
            if ($.fn.fappear.timeout) clearTimeout($.fn.fappear.timeout);
            $.fn.fappear.timeout = setTimeout($.fn.fappear.checkAll, 20);
        }
    });

    //Executar verificações quando esses métodos são chamados
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function (i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function () {
                var r = old.apply(this, arguments);
                $.fn.fappear.run();
                return r;
            }
        }
    });

})(jQuery);


(function ($) {
    $.fn.countTo = function (options) {
        // mescla as configurações de plug-in padrão com as opções personalizadas
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // quantas vezes para atualizar o valor, e quanto para incrementar o valor em cada atualização
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).each(function () {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,  // o número do elemento deve começar em
        to: 100,  // o número que o elemento deve terminar em
        speed: 1000,  // quanto tempo deve demorar para contar entre os números de destino
        refreshInterval: 100,  // quantas vezes o elemento deve ser atualizado
        decimals: 0,  // o número de casas decimais a mostrar
        onUpdate: null,  // método callback para cada vez que o elemento é atualizado,
        onComplete: null,  // método callback para quando o elemento termina a atualização
    };
})(jQuery);	