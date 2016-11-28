var jqueryNoConflict = jQuery;

//begin main function
jqueryNoConflict(document).ready(function() {
    retriveData();
});
//end main function

// grab data
function retriveData() {
    var dataSource = 'assets/json/working-data-file.json';
    jqueryNoConflict.getJSON(dataSource, renderDataVisualsTemplate);
};


// render compiled handlebars template
function renderDataVisualsTemplate(data) {
    handlebarsDebugHelper();
    renderHandlebarsTemplate('assets/templates/hbs/personal-info.hbs', '#personal-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/profile-info.hbs', '#profile-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/skills-info.hbs', '#skills-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/project-info.hbs', '#project-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/experience-info.hbs', '#experience-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/academics-info.hbs', '#academics-info', data);
    renderHandlebarsTemplate('assets/templates/hbs/interest-info.hbs', '#interest-info', data);
};

// render handlebars templates via ajax
function getTemplateAjax(path, callback) {
    var source, template;
    jqueryNoConflict.ajax({
        url: path,
        success: function(data) {
            source = data;
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
};

// function to compile handlebars template
function renderHandlebarsTemplate(withTemplate, inElement, withData) {
    getTemplateAjax(withTemplate, function(template) {
        jqueryNoConflict(inElement).html(template(withData));
    })
};

// add handlebars debugger
function handlebarsDebugHelper() {
    Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
    });
};
